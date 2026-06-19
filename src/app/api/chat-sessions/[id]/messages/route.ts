import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

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
    const { messages } = body;

    if (!Array.isArray(messages)) {
      return fail("Messages must be an array", 400);
    }

    // Delete old messages and insert new ones in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.chatMessage.deleteMany({ where: { sessionId: id } });

      if (messages.length > 0) {
        await tx.chatMessage.createMany({
          data: messages.map((m: any, i: number) => ({
            msgId: m.id || i,
            role: m.sender || "user",
            content: m.text || "",
            toolCall: m.toolCall ? JSON.stringify(m.toolCall) : null,
            status: m.status || null,
            statusTs: m.statusTimestamp || null,
            sessionId: id,
          })),
        });
      }

      await tx.chatSession.update({
        where: { id },
        data: { updatedAt: new Date() },
      });
    });

    // Update session title from first user message
    const firstUser = messages.find((m: any) => m.sender === "user" || m.role === "user");
    if (firstUser && existing.title === `چت ${new Date(existing.createdAt).toLocaleDateString("fa-IR")}`) {
      const text = firstUser.text || firstUser.content || "";
      const title = text.length > 40 ? text.slice(0, 40) + "…" : text;
      await prisma.chatSession.update({ where: { id }, data: { title } });
    }

    return success(null, "Messages saved");
  } catch (error) {
    console.error("SaveMessages error:", error);
    return fail("Error saving messages", 500);
  }
}
