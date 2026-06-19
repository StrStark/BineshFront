import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/server/auth";
import { success, fail } from "@/lib/server/response";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, token, deviceInfo, location, application } = await request.json();

    if (!phoneNumber || !token) {
      return fail("شماره موبایل یا کد تایید وارد نشده است");
    }

    const cleanPhone = phoneNumber.replace(/\s/g, "");

    // Find valid verification code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        phone: cleanPhone,
        code: token,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!verificationCode) {
      return fail("کد تایید نامعتبر یا منقضی شده است");
    }

    // Mark code as used
    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { usedAt: new Date() },
    });

    // Find account
    const account = await prisma.account.findUnique({
      where: { username: cleanPhone },
    });

    if (!account) {
      return fail("حساب کاربری یافت نشد");
    }

    // Create session
    const userSessionId = crypto.randomUUID();
    const accessToken = await signAccessToken({
      userId: account.id,
      username: account.username,
      role: account.role,
      sessionId: userSessionId,
    });

    const refreshToken = await signRefreshToken({
      userId: account.id,
      username: account.username,
      role: account.role,
      sessionId: userSessionId,
    });

    // Store session
    const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    await prisma.userSession.create({
      data: {
        userId: account.id,
        accessToken,
        refreshToken,
        userSessionId,
        expires,
      },
    });

    await setAuthCookies(accessToken, refreshToken);

    return success({
      id: account.id,
      accessToken,
      refreshToken,
      userSessionId,
      expires,
      userId: account.id,
    }, "ورود موفق");
  } catch (error) {
    console.error("ConfirmSignIn error:", error);
    return fail("خطا در تایید کد", 500);
  }
}
