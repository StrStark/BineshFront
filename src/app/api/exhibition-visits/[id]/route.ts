import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    const body = await request.json();
    const visit = await prisma.exhibitionVisit.update({
      where: { id },
      data: {
        ...body,
        visitDate: body.visitDate ? new Date(body.visitDate) : undefined,
      },
    });
    return success(visit, "بازدیدکننده بروزرسانی شد");
  } catch (error) {
    console.error("UpdateVisit error:", error);
    return fail("Error updating visit", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    await prisma.exhibitionVisit.delete({ where: { id } });
    return success(null, "بازدیدکننده حذف شد");
  } catch (error) {
    console.error("DeleteVisit error:", error);
    return fail("Error deleting visit", 500);
  }
}
