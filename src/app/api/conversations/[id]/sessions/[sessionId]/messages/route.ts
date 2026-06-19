import { NextRequest } from "next/server"
import { prisma } from "@/lib/server/prisma"
import { getServerSession } from "@/lib/server/auth"
import { success, fail } from "@/lib/server/response"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sessionId: string }> }
) {
  try {
    const sess = await getServerSession()
    if (!sess) return fail("Unauthorized", 401)

    const { id: conversationId, sessionId } = await params

    const conv = await prisma.conversation.findUnique({ where: { id: conversationId } })
    if (!conv || conv.accountId !== sess.userId) {
      return fail("Not found", 404)
    }

    const body = await request.json()
    const messages: { id: number; text: string; sender: string; toolCall?: string; status?: string; statusTimestamp?: string }[] = body.messages || []

    // Replace all messages in this session
    const updated = await prisma.$transaction(async (tx) => {
      // Delete existing messages
      await tx.chatMessage.deleteMany({ where: { sessionId } })

      // Create new messages
      if (messages.length > 0) {
        await tx.chatMessage.createMany({
          data: messages.map((m, i) => ({
            msgId: i + 1,
            role: m.sender,
            content: m.text,
            toolCall: m.toolCall || null,
            status: m.status || null,
            statusTs: m.statusTimestamp || null,
            sessionId,
          })),
        })
      }

      // Update conversation timestamp
      await tx.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      })

      // Return the session with messages
      return tx.session.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { msgId: "asc" } } },
      })
    })

    return success(updated)
  } catch (err) {
    console.error("UpdateSessionMessages error:", err)
    return fail("Failed to update session messages", 500)
  }
}
