import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function GET(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const items = await prisma.warehouseItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return success(items);
  } catch (error) {
    console.error("GetWarehouse error:", error);
    return fail("Error fetching warehouse", 500);
  }
}

export async function POST(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const item = await prisma.warehouseItem.create({ data: body });
    return success(item, "محصول به انبار اضافه شد");
  } catch (error) {
    console.error("CreateWarehouseItem error:", error);
    return fail("Error creating warehouse item", 500);
  }
}
