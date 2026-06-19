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
}

interface ApiSession {
  id: string
  title: string
  pinned: boolean
  createdAt: string
  updatedAt: string
  messages?: ApiMessage[]
}

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

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [loadedSessionMessages, setLoadedSessionMessages] = useState<StoredMessage[]>([])
  const [loading, setLoading] = useState(true)
  const loadedRef = useRef(false)

  // Load sessions from API on mount
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await apiFetch<ApiSession[]>("/api/chat-sessions")
        if (!cancelled) {
          setSessions(
            data.map((s) => ({
              ...s,
              messages: [],
            })),
          )
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

    const created = await apiFetch<ApiSession>("/api/chat-sessions", {
      method: "POST",
      body: JSON.stringify({ title }),
    })

    const newSession: ChatSession = {
      id: created.id,
      title: created.title,
      pinned: false,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      messages: [],
    }

    setSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    setLoadedSessionMessages([])
    return newSession.id
  }, [])

  const deleteSession = useCallback(async (id: string) => {
    await apiFetch(`/api/chat-sessions/${id}`, { method: "DELETE" })
    setSessions((prev) => prev.filter((s) => s.id !== id))
    setCurrentSessionId((prev) => (prev === id ? null : prev))
    setLoadedSessionMessages((prev) => (currentSessionId === id ? [] : prev))
  }, [currentSessionId])

  const renameSession = useCallback(async (id: string, title: string) => {
    await apiFetch(`/api/chat-sessions/${id}`, {
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
    await apiFetch(`/api/chat-sessions/${id}`, {
      method: "PUT",
      body: JSON.stringify({ pinned }),
    })
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, pinned, updatedAt: new Date().toISOString() } : s)),
    )
  }, [sessions])

  const loadSession = useCallback(async (id: string) => {
    try {
      const data = await apiFetch<ApiSession>(`/api/chat-sessions/${id}`)
      setCurrentSessionId(data.id)
      const storedMessages = (data.messages || []).map(toStoredMessage)
      setLoadedSessionMessages(storedMessages)
    } catch {
      // silently fail
    }
  }, [])

  const saveMessagesToSession = useCallback(
    async (sessionId: string, messages: StoredMessage[], firstUserText?: string) => {
      await apiFetch(`/api/chat-sessions/${sessionId}/messages`, {
        method: "PUT",
        body: JSON.stringify({ messages }),
      })

      // Auto-update title from first user message
      if (firstUserText) {
        const title =
          firstUserText.length > 40
            ? firstUserText.slice(0, 40) + "…"
            : firstUserText
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? { ...s, title, messages, updatedAt: new Date().toISOString() }
              : s,
          ),
        )
      } else {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? { ...s, messages, updatedAt: new Date().toISOString() }
              : s,
          ),
        )
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
