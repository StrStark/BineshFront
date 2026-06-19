import { NextRequest } from "next/server"
import { prisma } from "@/lib/server/prisma"
import { getServerSession } from "@/lib/server/auth"
import { success, fail } from "@/lib/server/response"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session) return fail("Unauthorized", 401)

    const { id: conversationId } = await params

    const conv = await prisma.conversation.findUnique({ where: { id: conversationId } })
    if (!conv || conv.accountId !== session.userId) {
      return fail("Not found", 404)
    }

    const sessions = await prisma.session.findMany({
      where: { conversationId },
      orderBy: { order: "asc" },
      include: {
        messages: { orderBy: { msgId: "asc" } },
      },
    })

    return success(sessions)
  } catch (err) {
    console.error("GetSessions error:", err)
    return fail("Failed to fetch sessions", 500)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sess = await getServerSession()
    if (!sess) return fail("Unauthorized", 401)

    const { id: conversationId } = await params

    const conv = await prisma.conversation.findUnique({ where: { id: conversationId } })
    if (!conv || conv.accountId !== sess.userId) {
      return fail("Not found", 404)
    }

    const body = await request.json()
    const content: string = body.content || ""

    // Determine the next order number
    const lastSession = await prisma.session.findFirst({
      where: { conversationId },
      orderBy: { order: "desc" },
    })
    const nextOrder = (lastSession?.order ?? 0) + 1

    // Check if there's already a processing session in this conversation
    const processingExists = await prisma.session.findFirst({
      where: { conversationId, status: "processing" },
    })

    const status = processingExists ? "queued" : "processing"

    const newSession = await prisma.session.create({
      data: {
        conversationId,
        status,
        order: nextOrder,
        messages: {
          create: {
            msgId: 1,
            role: "user",
            content,
          },
        },
      },
      include: {
        messages: { orderBy: { msgId: "asc" } },
      },
    })

    return success(newSession, "Session created")
  } catch (err) {
    console.error("CreateSession error:", err)
    return fail("Failed to create session", 500)
  }
}
