import { NextRequest } from "next/server"
import { prisma } from "@/lib/server/prisma"
import { requireAuth } from "@/lib/server/middleware"
import { tools, executeTool } from "@/lib/server/ai-tools"
import OpenAI from "openai"

export const runtime = "nodejs"

function sse(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
}

export async function POST(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request)
  if (errorResponse) return errorResponse

  const encoder = new TextEncoder()

  try {
    const { messages } = await request.json()
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(sse("error", { message: "Messages are required" }), {
        status: 400,
        headers: { "Content-Type": "text/event-stream" },
      })
    }

    const prefs = await prisma.aiPreference.findUnique({
      where: { accountId: session!.userId },
    })

    const apiKey = prefs?.apiKey || process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(sse("error", { message: "API Key not configured. Set it in AI settings." }), {
        status: 400,
        headers: { "Content-Type": "text/event-stream" },
      })
    }

    const character = prefs?.character || "حرفه‌ای"
    const customInstructions = prefs?.customInstructions || ""
    const aboutJob = prefs?.aboutJob || ""
    const aboutInterests = prefs?.aboutInterests || ""

    const aboutParts: string[] = []
    if (aboutJob) aboutParts.push(`شغل کاربر: ${aboutJob}`)
    if (aboutInterests) aboutParts.push(`علایق کاربر: ${aboutInterests}`)
    const aboutSection = aboutParts.length > 0 ? `\n## درباره کاربر\n${aboutParts.join("\n")}` : ""

    const systemPrompt = `شما یک دستیار هوش مصنوعی حرفه‌ای برای پنل مدیریت کسب‌وکار هستید.
شخصیت شما: ${character}
${customInstructions ? `\n## دستورالعمل‌های ویژه\n${customInstructions}` : ""}${aboutSection}

## قابلیت‌های شما
- دسترسی کامل به دیتابیس کسب‌وکار برای پاسخ به سوالات کاربر
- تحلیل داده‌های فروش، محصولات، مشتریان، انبار و امور مالی
- ارائه گزارش‌های دقیق و بینش‌های تجاری

## زبان پاسخگویی
- همیشه به زبان فارسی پاسخ دهید
- پاسخ‌ها را به صورت ساختاریافته و حرفه‌ای ارائه کنید
- از اعداد فارسی استفاده کنید
- در صورت نیاز از ابزارهای موجود برای استعلام داده استفاده کنید`

    const openai = new OpenAI({ apiKey })

    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(encoder.encode(sse("status", { status: "در حال تحلیل درخواست شما..." })))

          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: systemPrompt },
              ...messages.map((m: { role: string; content: string }) => ({ role: m.role as "user" | "assistant", content: m.content })),
            ],
            tools,
            stream: true,
            max_tokens: 4096,
          })

          let functionName = ""
          let functionArgs = ""

          for await (const chunk of response) {
            const delta = chunk.choices?.[0]?.delta

            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                if (tc.function?.name) {
                  functionName = tc.function.name
                  functionArgs = tc.function.arguments || ""
                } else if (tc.function?.arguments) {
                  functionArgs += tc.function.arguments
                }
              }

              if (chunk.choices[0]?.finish_reason === "tool_calls") {
                const parsed = safeParse(functionArgs)
                controller.enqueue(encoder.encode(sse("status", { status: `در حال استعلام ${getToolLabel(functionName)}...` })))

                try {
                  const result = await executeTool(functionName, parsed || {})
                  const followUp = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [
                      { role: "system", content: systemPrompt },
                      ...messages.map((m: { role: string; content: string }) => ({ role: m.role as "user" | "assistant", content: m.content })),
                      {
                        role: "assistant",
                        content: null,
                        tool_calls: [
                          {
                            id: `call_${Date.now()}`,
                            type: "function",
                            function: { name: functionName, arguments: functionArgs },
                          },
                        ],
                      },
                      { role: "tool", tool_call_id: `call_${Date.now()}`, content: result },
                    ],
                    stream: true,
                    max_tokens: 4096,
                  })

                  for await (const followChunk of followUp) {
                    const token = followChunk.choices?.[0]?.delta?.content
                    if (token) {
                      controller.enqueue(encoder.encode(sse("token", { token })))
                    }
                  }
                } catch (err) {
                  controller.enqueue(encoder.encode(sse("error", { message: `خطا در استعلام ${functionName}` })))
                }
                functionName = ""
                functionArgs = ""
                continue
              }
            }

            const token = delta?.content
            if (token) {
              controller.enqueue(encoder.encode(sse("token", { token })))
            }
          }

          controller.enqueue(encoder.encode(sse("done", {})))
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "خطا در ارتباط با سرور هوش مصنوعی"
          controller.enqueue(encoder.encode(sse("error", { message: msg })))
          controller.enqueue(encoder.encode(sse("done", {})))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch {
    return new Response(sse("error", { message: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "text/event-stream" },
    })
  }
}

function safeParse(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function getToolLabel(name: string): string {
  const labels: Record<string, string> = {
    get_sales_summary: "فروش",
    get_products: "محصولات",
    get_products_by_category: "محصولات",
    get_customers: "مشتریان",
    get_warehouse_items: "انبار",
    get_financial_transactions: "مالی",
    get_dashboard_stats: "داشبورد",
    get_sales_by_period: "فروش",
    get_low_stock_products: "کالاهای کم‌موجودی",
  }
  return labels[name] || name
}
