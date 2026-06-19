import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function GET(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    let prefs = await prisma.aiPreference.findUnique({
      where: { accountId: session!.userId },
    });

    if (!prefs) {
      prefs = await prisma.aiPreference.create({
        data: { accountId: session!.userId },
      });
    }

    return success({
      character: prefs.character,
      customInstructions: prefs.customInstructions,
      aboutJob: prefs.aboutJob,
      aboutInterests: prefs.aboutInterests,
      apiKey: prefs.apiKey,
    });
  } catch (error) {
    console.error("GetAiSettings error:", error);
    return fail("Error fetching AI settings", 500);
  }
}

export async function PUT(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { character, customInstructions, aboutJob, aboutInterests, apiKey } = body;

    const data: Record<string, string> = {};
    if (character !== undefined) data.character = character;
    if (customInstructions !== undefined) data.customInstructions = customInstructions;
    if (aboutJob !== undefined) data.aboutJob = aboutJob;
    if (aboutInterests !== undefined) data.aboutInterests = aboutInterests;
    if (apiKey !== undefined) data.apiKey = apiKey;

    const prefs = await prisma.aiPreference.upsert({
      where: { accountId: session!.userId },
      create: { accountId: session!.userId, ...data },
      update: data,
    });

    return success({
      character: prefs.character,
      customInstructions: prefs.customInstructions,
      aboutJob: prefs.aboutJob,
      aboutInterests: prefs.aboutInterests,
      apiKey: prefs.apiKey,
    });
  } catch (error) {
    console.error("UpdateAiSettings error:", error);
    return fail("Error updating AI settings", 500);
  }
}
