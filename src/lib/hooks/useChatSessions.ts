"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { getCookie } from "../utils/auth"

interface ToolCall {
  toolCallId: string
  functionName: string
  argumentsJson: string
}

export interface StoredMessage {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: string
  isStreaming?: boolean
  toolCall?: ToolCall
  status?: string
  statusTimestamp?: string
}

export interface ChatSession {
  id: string
  title: string
  pinned: boolean
  createdAt: string
  updatedAt: string
  messages: StoredMessage[]
  sessions: { id: string; status: string; userText: string }[]
}

// --- New API types ---

interface ApiMessage {
  id: string
  msgId: number
  role: string
  content: string
  toolCall: string | null
  status: string | null
  statusTs: string | null
  createdAt: string
}

interface ApiSession {
  id: string
  conversationId: string
  status: string
  order: number
  messages: ApiMessage[]
  createdAt: string
  updatedAt: string
}

interface ApiConversation {
  id: string
  title: string
  pinned: boolean
  createdAt: string
  updatedAt: string
  sessions: ApiSession[]
}

// --- Conversion helpers ---

function toStoredMessage(m: ApiMessage): StoredMessage {
  return {
    id: m.msgId,
    text: m.content,
    sender: m.role as "user" | "ai",
    timestamp: m.createdAt,
    toolCall: m.toolCall ? JSON.parse(m.toolCall) : undefined,
    status: m.status || undefined,
    statusTimestamp: m.statusTs || undefined,
  }
}

function flattenMessages(sessions: ApiSession[]): StoredMessage[] {
  const all: StoredMessage[] = []
  for (const s of sessions) {
    for (const m of s.messages) {
      all.push(toStoredMessage(m))
    }
  }
  return all
}

// --- API helper ---

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getCookie("authToken")
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  const data = await res.json()
  if (data.code !== 200) throw new Error(data.message || "API error")
  return data.body as T
}

// --- Hook ---

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [loadedSessionMessages, setLoadedSessionMessages] = useState<StoredMessage[]>([])
  const [loading, setLoading] = useState(true)
  const loadedRef = useRef(false)

  function toChatSession(c: ApiConversation): ChatSession {
    return {
      id: c.id,
      title: c.title,
      pinned: c.pinned,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      messages: flattenMessages(c.sessions),
      sessions: c.sessions.map((s) => ({
        id: s.id,
        status: s.status,
        userText: s.messages.find((m) => m.role === "user")?.content || "",
      })),
    }
  }

  // Load conversations from API on mount
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await apiFetch<ApiConversation[]>("/api/conversations")
        if (!cancelled) {
          setSessions(data.map(toChatSession))
        }
      } catch {
        // silently fail
      } finally {
        if (!cancelled) {
          setLoading(false)
          loadedRef.current = true
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  const createSession = useCallback(async (firstUserMessage?: string) => {
    const title = firstUserMessage
      ? firstUserMessage.length > 40
        ? firstUserMessage.slice(0, 40) + "…"
        : firstUserMessage
      : "چت جدید"

    const created = await apiFetch<ApiConversation>("/api/conversations", {
      method: "POST",
      body: JSON.stringify({ title }),
    })

    if (firstUserMessage) {
      try {
        await apiFetch<ApiSession>(`/api/conversations/${created.id}/sessions`, {
          method: "POST",
          body: JSON.stringify({ content: firstUserMessage }),
        })
      } catch {
        // session creation failed, conversation created at least
      }
    }

    let conversation = created
    if (firstUserMessage) {
      try {
        conversation = await apiFetch<ApiConversation>(`/api/conversations/${created.id}`)
      } catch {
        // use the original response
      }
    }

    const newSession = toChatSession(conversation)

    setSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    setLoadedSessionMessages(newSession.messages)
    return newSession.id
  }, [])

  const deleteSession = useCallback(async (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    setCurrentSessionId((prev) => (prev === id ? null : prev))
    setLoadedSessionMessages([])
    try {
      await apiFetch(`/api/conversations/${id}`, { method: "DELETE" })
    } catch {
      // best-effort
    }
  }, [])

  const renameSession = useCallback(async (id: string, title: string) => {
    await apiFetch(`/api/conversations/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title }),
    })
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title, updatedAt: new Date().toISOString() } : s)),
    )
  }, [])

  const togglePinSession = useCallback(async (id: string) => {
    const session = sessions.find((s) => s.id === id)
    if (!session) return
    const pinned = !session.pinned
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, pinned, updatedAt: new Date().toISOString() } : s)),
    )
    apiFetch(`/api/conversations/${id}`, {
      method: "PUT",
      body: JSON.stringify({ pinned }),
    }).catch(() => {})
  }, [sessions])

  const loadSession = useCallback(async (id: string) => {
    try {
      const data = await apiFetch<ApiConversation>(`/api/conversations/${id}`)
      setCurrentSessionId(data.id)
      const storedMessages = flattenMessages(data.sessions)
      setLoadedSessionMessages(storedMessages)
    } catch {
      // silently fail
    }
  }, [])

  /**
   * Save messages to the conversation by updating the most recent session's messages.
   * Each session holds messages for one exchange (user message + tool calls + AI response).
   */
  const saveMessagesToSession = useCallback(
    async (conversationId: string, messages: StoredMessage[], firstUserText?: string) => {
      try {
        const conv = await apiFetch<ApiConversation>(`/api/conversations/${conversationId}`)
        const latestSession = conv.sessions[conv.sessions.length - 1]
        if (latestSession) {
          let lastUserIdx = -1
          for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].sender === "user") {
              lastUserIdx = i
              break
            }
          }
          const sessionMsgs = lastUserIdx >= 0 ? messages.slice(lastUserIdx) : messages
          await apiFetch(
            `/api/conversations/${conversationId}/sessions/${latestSession.id}/messages`,
            { method: "PUT", body: JSON.stringify({ messages: sessionMsgs }) },
          )
        }
        // Refresh local state from server
        const updated = await apiFetch<ApiConversation>(`/api/conversations/${conversationId}`)
        setSessions((prev) =>
          prev.map((s) => (s.id === conversationId ? toChatSession(updated) : s)),
        )
      } catch {
        // Silently fail
      }
    },
    [],
  )

  const newChat = useCallback(() => {
    setCurrentSessionId(null)
    setLoadedSessionMessages([])
  }, [])

  return {
    sessions,
    sortedSessions,
    currentSessionId,
    loadedSessionMessages,
    loading,
    createSession,
    deleteSession,
    renameSession,
    togglePinSession,
    loadSession,
    saveMessagesToSession,
    newChat,
  }
}
