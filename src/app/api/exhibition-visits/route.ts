import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function GET(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const visits = await prisma.exhibitionVisit.findMany({
      orderBy: { createdAt: "desc" },
    });
    return success(visits);
  } catch (error) {
    console.error("GetExhibitionVisits error:", error);
    return fail("Error fetching visits", 500);
  }
}

export async function POST(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const visit = await prisma.exhibitionVisit.create({
      data: {
        ...body,
        visitDate: new Date(body.visitDate),
      },
    });
    return success(visit, "بازدیدکننده ثبت شد");
  } catch (error) {
    console.error("CreateVisit error:", error);
    return fail("Error creating visit", 500);
  }
}
