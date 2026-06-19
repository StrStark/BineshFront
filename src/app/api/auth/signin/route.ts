import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { success, fail } from "@/lib/server/response";
import crypto from "crypto";

const SMS_BASE_URL = process.env.IPPANEL_BASE_URL || "https://edge.ippanel.com/v1";
const SMS_PATTERN_PATH = process.env.IPPANEL_PATTERN_PATH || "api/send";
const SMS_API_KEY = process.env.IPPANEL_API_KEY || "";
const SMS_PATTERN_CODE = process.env.IPPANEL_PATTERN_CODE || "";
const SMS_ORIGINATOR = process.env.IPPANEL_FROM_NUMBER || "+983000505";
const SMS_MOCK = process.env.SMS_MOCK === "true";

function normalizePhone(phone: string) {
  const cleaned = phone.trim().replace(/\s+/g, "").replace(/-/g, "");
  if (cleaned.startsWith("+98")) return cleaned;
  if (cleaned.startsWith("0098")) return `+${cleaned.slice(2)}`;
  if (cleaned.startsWith("98")) return `+${cleaned}`;
  if (cleaned.startsWith("09") && cleaned.length === 11) return `+98${cleaned.slice(1)}`;
  if (cleaned.startsWith("9") && cleaned.length === 10) return `+98${cleaned}`;
  return `+98${cleaned}`;
}

function normalizeFromNumber(from: string) {
  const cleaned = from.trim().replace(/\s+/g, "").replace(/-/g, "");
  if (cleaned.startsWith("+98")) return cleaned;
  if (cleaned.startsWith("0")) return `+98${cleaned.slice(1)}`;
  return `+${cleaned}`;
}

function joinUrl(baseUrl: string, path: string) {
  const a = baseUrl.replace(/\/+$/, "");
  const b = path.replace(/^\/+/, "");
  return `${a}/${b}`;
}

async function sendSms(phone: string, code: string) {
  const to = normalizePhone(phone);

  if (SMS_MOCK || !SMS_API_KEY) {
    console.log(`[SMS-MOCK] OTP for ${to}: ${code}`);
    return;
  }

  const from = normalizeFromNumber(SMS_ORIGINATOR);
  const url = joinUrl(SMS_BASE_URL, SMS_PATTERN_PATH);

  const payload = {
    sending_type: "pattern",
    from_number: from,
    code: SMS_PATTERN_CODE,
    recipients: [to],
    params: { code },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: SMS_API_KEY,
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    console.log(`[SMS] Sent to ${to}:`, JSON.stringify(result));
  } catch (err) {
    console.warn(`[SMS] Failed to send to ${to}:`, err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return fail("شماره موبایل وارد نشده است");
    }

    // Clean phone number
    const cleanPhone = phoneNumber.replace(/\s/g, "");

    // Find or create account
    let account = await prisma.account.findUnique({
      where: { username: cleanPhone },
    });

    if (!account) {
      account = await prisma.account.create({
        data: {
          username: cleanPhone,
          password: "",
          name: cleanPhone,
          role: "user",
        },
      });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    await prisma.verificationCode.create({
      data: {
        phone: cleanPhone,
        code: otp,
        expiresAt,
      },
    });

    console.log(`[DEV] OTP for ${cleanPhone}: ${otp}`);

    // Send SMS in background (don't block response)
    sendSms(cleanPhone, otp);

    return success(null, "کد تایید ارسال شد");
  } catch (error) {
    console.error("SignIn error:", error);
    return fail("خطا در ارسال کد تایید", 500);
  }
}
