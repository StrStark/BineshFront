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
    const data: Record<string, unknown> = {}

    if (typeof body.status === "string") data.status = body.status

    const updated = await prisma.session.update({
      where: { id: sessionId },
      data,
      include: {
        messages: { orderBy: { msgId: "asc" } },
      },
    })

    return success(updated)
  } catch (err) {
    console.error("UpdateSession error:", err)
    return fail("Failed to update session", 500)
  }
}

export async function DELETE(
  _request: NextRequest,
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

    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {})

    return success({ deleted: true })
  } catch (err) {
    console.error("DeleteSession error:", err)
    return fail("Failed to delete session", 500)
  }
}
