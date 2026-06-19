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
    const { messages, conversationId } = await request.json()
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(sse("error", { message: "Messages are required" }), {
        status: 400,
        headers: { "Content-Type": "text/event-stream" },
      })
    }

    let prefs: Awaited<ReturnType<typeof prisma.aiPreference.findUnique>> | null = null
    try {
      prefs = await prisma.aiPreference.findUnique({
        where: { accountId: session!.userId },
      })
    } catch (queryErr) {
      return new Response(sse("error", { message: `خطا در خواندن تنظیمات: ${queryErr instanceof Error ? queryErr.message : String(queryErr)}` }), {
        status: 400,
        headers: { "Content-Type": "text/event-stream" },
      })
    }

    const apiKey = prefs?.apiKey || process.env.OPENAI_API_KEY
    const apiUrl = prefs?.apiUrl || "https://api.openai.com/v1"
    if (!apiKey) {
      return new Response(sse("error", { message: `کلید API تنظیم نشده است. کاربر ${session!.userId} - پیشفرض یافت نشد` }), {
        status: 400,
        headers: { "Content-Type": "text/event-stream" },
      })
    }

    const model = prefs?.model || "gpt-4o-mini"
    const character = prefs?.character || "حرفه‌ای"
    const customInstructions = prefs?.customInstructions || ""

    // Fetch user's name from account
    const account = await prisma.account.findUnique({ where: { id: session!.userId } })
    const userName = account?.name || account?.username || "کاربر"

    const aboutParts: string[] = []
    aboutParts.push(`نام کاربر: ${userName}`)
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

    const openai = new OpenAI({ apiKey, baseURL: apiUrl })

    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(encoder.encode(sse("status", { status: "در حال تحلیل درخواست شما..." })))

          let totalPromptTokens = 0
          let totalCompletionTokens = 0
          let fullResponse = ""
          const toolCalls: { name: string; args: string; result: string }[] = []

          const response = await openai.chat.completions.create({
            model,
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

            if (chunk.usage) {
              totalPromptTokens += chunk.usage.prompt_tokens || 0
              totalCompletionTokens += chunk.usage.completion_tokens || 0
            }

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
                  toolCalls.push({ name: functionName, args: functionArgs, result })
                  const followUp = await openai.chat.completions.create({
                    model,
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
                    if (followChunk.usage) {
                      totalPromptTokens += followChunk.usage.prompt_tokens || 0
                      totalCompletionTokens += followChunk.usage.completion_tokens || 0
                    }
                    const token = followChunk.choices?.[0]?.delta?.content
                    if (token) {
                      fullResponse += token
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
              fullResponse += token
              controller.enqueue(encoder.encode(sse("token", { token })))
            }
          }

          // Save AI response to session if conversationId is provided
          if (conversationId) {
            try {
              const lastSession = await prisma.session.findFirst({
                where: { conversationId },
                orderBy: { order: "desc" },
              })
              if (lastSession) {
                const existingMsgs = await prisma.chatMessage.findMany({
                  where: { sessionId: lastSession.id },
                  orderBy: { msgId: "asc" },
                })
                let nextMsgId = existingMsgs.length > 0
                  ? Math.max(...existingMsgs.map((m) => m.msgId)) + 1
                  : 2 // msgId 1 is the user message

                // Save tool call messages if any
                for (const tc of toolCalls) {
                  // Assistant message with tool call
                  await prisma.chatMessage.create({
                    data: {
                      msgId: nextMsgId++,
                      role: "assistant",
                      content: "",
                      toolCall: JSON.stringify({
                        toolCallId: `call_${Date.now()}_${nextMsgId}`,
                        functionName: tc.name,
                        argumentsJson: tc.args,
                      }),
                      sessionId: lastSession.id,
                    },
                  })
                  // Tool result message
                  await prisma.chatMessage.create({
                    data: {
                      msgId: nextMsgId++,
                      role: "tool",
                      content: tc.result,
                      sessionId: lastSession.id,
                    },
                  })
                }

                // Save the final AI response
                if (fullResponse) {
                  await prisma.chatMessage.create({
                    data: {
                      msgId: nextMsgId++,
                      role: "assistant",
                      content: fullResponse,
                      sessionId: lastSession.id,
                    },
                  })
                }

                await prisma.session.update({
                  where: { id: lastSession.id },
                  data: { status: "done", updatedAt: new Date() },
                })

                await prisma.conversation.update({
                  where: { id: conversationId },
                  data: { updatedAt: new Date() },
                })

                // Process next queued session if any
                const nextQueued = await prisma.session.findFirst({
                  where: { conversationId, status: "queued" },
                  orderBy: { order: "asc" },
                })
                if (nextQueued) {
                  await prisma.session.update({
                    where: { id: nextQueued.id },
                    data: { status: "processing" },
                  })
                }
              }
            } catch {
              // Best-effort save
            }
          }

          controller.enqueue(encoder.encode(sse("done", {})))
          controller.enqueue(encoder.encode(sse("usage", {
            promptTokens: totalPromptTokens,
            completionTokens: totalCompletionTokens,
            totalTokens: totalPromptTokens + totalCompletionTokens,
            model,
          })))
        } catch (err: unknown) {
          // Mark session as error if conversationId was provided
          if (conversationId) {
            try {
              const lastSession = await prisma.session.findFirst({
                where: { conversationId },
                orderBy: { order: "desc" },
              })
              if (lastSession && lastSession.status === "processing") {
                await prisma.session.update({
                  where: { id: lastSession.id },
                  data: { status: "error", updatedAt: new Date() },
                })
              }
            } catch {
              // best-effort
            }
          }
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
  } catch (err) {
    console.error("AI chat POST error:", err)
    const msg = err instanceof Error ? err.message : "Invalid request"
    return new Response(sse("error", { message: msg }), {
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
