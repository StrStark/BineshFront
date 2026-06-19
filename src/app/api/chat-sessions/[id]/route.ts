import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    const chatSession = await prisma.chatSession.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!chatSession || chatSession.accountId !== session!.userId) {
      return fail("Session not found", 404);
    }

    return success(chatSession);
  } catch (error) {
    console.error("GetChatSession error:", error);
    return fail("Error fetching session", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    const existing = await prisma.chatSession.findUnique({ where: { id } });
    if (!existing || existing.accountId !== session!.userId) {
      return fail("Session not found", 404);
    }

    const body = await request.json();
    const { title, pinned } = body;

    const updated = await prisma.chatSession.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(pinned !== undefined && { pinned }),
      },
    });

    return success(updated, "Session updated");
  } catch (error) {
    console.error("UpdateChatSession error:", error);
    return fail("Error updating session", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    const existing = await prisma.chatSession.findUnique({ where: { id } });
    if (!existing || existing.accountId !== session!.userId) {
      return fail("Session not found", 404);
    }

    await prisma.chatSession.delete({ where: { id } });
    return success(null, "Session deleted");
  } catch (error) {
    console.error("DeleteChatSession error:", error);
    return fail("Error deleting session", 500);
  }
}
