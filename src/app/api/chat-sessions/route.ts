import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function GET(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const sessions = await prisma.chatSession.findMany({
      where: { accountId: session!.userId },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    });
    return success(sessions);
  } catch (error) {
    console.error("GetChatSessions error:", error);
    return fail("Error fetching sessions", 500);
  }
}

export async function POST(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { title, messages } = body;

    const chatSession = await prisma.chatSession.create({
      data: {
        title: title || "چت جدید",
        accountId: session!.userId,
        messages: messages
          ? {
              create: messages.map((m: any, i: number) => ({
                msgId: m.id || i,
                role: m.sender || "user",
                content: m.text || "",
                toolCall: m.toolCall ? JSON.stringify(m.toolCall) : null,
                status: m.status || null,
                statusTs: m.statusTimestamp || null,
              })),
            }
          : undefined,
      },
      include: { messages: true },
    });

    return success(chatSession, "Session created");
  } catch (error) {
    console.error("CreateChatSession error:", error);
    return fail("Error creating session", 500);
  }
}
