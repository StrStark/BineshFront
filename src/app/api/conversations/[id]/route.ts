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

    const { id } = await params

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        sessions: {
          orderBy: { createdAt: "asc" },
          include: {
            messages: { orderBy: { msgId: "asc" } },
          },
        },
      },
    })

    if (!conversation || conversation.accountId !== session.userId) {
      return fail("Not found", 404)
    }

    return success(conversation)
  } catch (err) {
    console.error("GetConversation error:", err)
    return fail("Failed to fetch conversation", 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sess = await getServerSession()
    if (!sess) return fail("Unauthorized", 401)

    const { id } = await params

    const existing = await prisma.conversation.findUnique({ where: { id } })
    if (!existing || existing.accountId !== sess.userId) {
      return fail("Not found", 404)
    }

    const body = await request.json()
    const data: Record<string, unknown> = {}
    if (typeof body.title === "string") data.title = body.title
    if (typeof body.pinned === "boolean") data.pinned = body.pinned

    const updated = await prisma.conversation.update({
      where: { id },
      data,
    })

    return success(updated)
  } catch (err) {
    console.error("UpdateConversation error:", err)
    return fail("Failed to update conversation", 500)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session) return fail("Unauthorized", 401)

    const { id } = await params

    const existing = await prisma.conversation.findUnique({ where: { id } })
    if (!existing || existing.accountId !== session.userId) {
      return fail("Not found", 404)
    }

    await prisma.conversation.delete({ where: { id } }).catch(() => {})

    return success({ deleted: true })
  } catch (err) {
    console.error("DeleteConversation error:", err)
    return fail("Failed to delete conversation", 500)
  }
}
