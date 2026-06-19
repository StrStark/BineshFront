import { NextRequest } from "next/server"
import { prisma } from "@/lib/server/prisma"
import { getServerSession } from "@/lib/server/auth"
import { success, fail } from "@/lib/server/response"

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) return fail("Unauthorized", 401)

    const conversations = await prisma.conversation.findMany({
      where: { accountId: session.userId },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
      include: {
        sessions: {
          orderBy: { createdAt: "asc" },
          include: {
            messages: { orderBy: { msgId: "asc" } },
          },
        },
      },
    })

    return success(conversations)
  } catch (err) {
    console.error("GetConversations error:", err)
    return fail("Failed to fetch conversations", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return fail("Unauthorized", 401)

    const body = await request.json()
    const title = body.title || "گفتگوی جدید"

    const conversation = await prisma.conversation.create({
      data: {
        title,
        accountId: session.userId,
      },
      include: {
        sessions: {
          orderBy: { createdAt: "asc" },
          include: {
            messages: { orderBy: { msgId: "asc" } },
          },
        },
      },
    })

    return success(conversation, "Conversation created")
  } catch (err) {
    console.error("CreateConversation error:", err)
    return fail("Failed to create conversation", 500)
  }
}
