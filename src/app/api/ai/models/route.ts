import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/server/middleware"

export async function GET(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request)
  if (errorResponse) return errorResponse

  const { searchParams } = new URL(request.url)
  const apiUrl = searchParams.get("apiUrl")
  const apiKey = searchParams.get("apiKey")

  if (!apiUrl) {
    return Response.json({ success: false, error: "apiUrl is required" }, { status: 400 })
  }

  try {
    const baseUrl = apiUrl.replace(/\/+$/, "")

    const res = await fetch(`${baseUrl}/models`, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      signal: AbortSignal.timeout(60000),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      return Response.json({ success: false, error: `Provider returned ${res.status}: ${text.slice(0, 200)}` }, { status: res.status })
    }

    const data = await res.json()

    const models: { id: string; owned_by?: string }[] = (data.data || data).map((m: { id: string; owned_by?: string }) => ({
      id: m.id,
      owned_by: m.owned_by,
    }))

    models.sort((a, b) => a.id.localeCompare(b.id))

    return Response.json({ success: true, data: models })
  } catch (err: any) {
    console.error("FetchModels error:", err.message || err)
    const msg = err.name === "TimeoutError" || err.code === 23
      ? "ارتباط با provider برقرار نشد (Timeout). آدرس API را بررسی کنید."
      : `خطا در دریافت مدل‌ها: ${err.message || "خطای نامشخص"}`
    return Response.json({ success: false, error: msg }, { status: 500 })
  }
}
