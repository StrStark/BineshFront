import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function GET(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const account = await prisma.account.findUnique({
      where: { id: session!.userId },
    });

    if (!account) {
      return fail("User not found", 404);
    }

    return success({
      id: account.id,
      username: account.username,
      name: account.name,
      role: account.role,
      position: account.position || "",
      title: account.title || "",
      status: account.status || "active",
    });
  } catch (error) {
    console.error("Me error:", error);
    return fail("Error fetching user", 500);
  }
}
