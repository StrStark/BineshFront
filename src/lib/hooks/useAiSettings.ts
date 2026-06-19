"use client"

import { useState, useEffect, useCallback } from "react"

export interface AiSettings {
  character: string
  customInstructions: string
  aboutJob: string
  aboutInterests: string
  apiKey: string
}

interface UseAiSettingsReturn {
  settings: AiSettings | null
  loading: boolean
  error: string | null
  updateSettings: (partial: Partial<AiSettings>) => Promise<void>
}

const LOCAL_KEY = "aiSettingsCache"

function loadCache(): AiSettings | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveCache(settings: AiSettings) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(settings))
}

export function useAiSettings(): UseAiSettingsReturn {
  const [settings, setSettings] = useState<AiSettings | null>(loadCache)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/ai-settings")
      if (!res.ok) {
        throw new Error("Failed to fetch AI settings")
      }
      const json = await res.json()
      const data = json.data || json
      const s: AiSettings = {
        character: data.character || "حرفه‌ای",
        customInstructions: data.customInstructions || "",
        aboutJob: data.aboutJob || "",
        aboutInterests: data.aboutInterests || "",
        apiKey: data.apiKey || "",
      }
      setSettings(s)
      saveCache(s)
    } catch (err) {
      const fallback = loadCache()
      if (fallback) {
        setSettings(fallback)
      }
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const updateSettings = useCallback(async (partial: Partial<AiSettings>) => {
    const prev = settings || {
      character: "حرفه‌ای",
      customInstructions: "",
      aboutJob: "",
      aboutInterests: "",
      apiKey: "",
    }
    const merged: AiSettings = { ...prev, ...partial }
    setSettings(merged)
    saveCache(merged)

    try {
      const res = await fetch("/api/ai-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial),
      })
      if (!res.ok) {
        throw new Error("Failed to save AI settings")
      }
      const json = await res.json()
      const data = json.data || json
      const s: AiSettings = {
        character: data.character || merged.character,
        customInstructions: data.customInstructions || merged.customInstructions,
        aboutJob: data.aboutJob || merged.aboutJob,
        aboutInterests: data.aboutInterests || merged.aboutInterests,
        apiKey: data.apiKey || merged.apiKey,
      }
      setSettings(s)
      saveCache(s)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }, [settings])

  return { settings, loading, error, updateSettings }
}
