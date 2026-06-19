import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { verifyToken, signAccessToken, signRefreshToken, setAuthCookies, clearAuthCookies } from "@/lib/server/auth";
import { success, fail } from "@/lib/server/response";

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return fail("Refresh token required", 401);
    }

    // Verify the refresh token
    let payload;
    try {
      payload = await verifyToken(refreshToken);
    } catch {
      await clearAuthCookies();
      return fail("Invalid refresh token", 401);
    }

    // Find session
    const session = await prisma.userSession.findFirst({
      where: {
        userId: payload.userId,
        userSessionId: payload.sessionId,
        refreshToken,
      },
    });

    if (!session) {
      await clearAuthCookies();
      return fail("Session not found", 401);
    }

    // Issue new tokens
    const newAccessToken = await signAccessToken({
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
      sessionId: payload.sessionId,
    });

    const newRefreshToken = await signRefreshToken({
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
      sessionId: payload.sessionId,
    });

    const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    // Update session
    await prisma.userSession.update({
      where: { id: session.id },
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expires,
      },
    });

    await setAuthCookies(newAccessToken, newRefreshToken);

    return success({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expires,
    }, "Token refreshed");
  } catch (error) {
    console.error("Refresh error:", error);
    return fail("خطا در تمدید توکن", 500);
  }
}
