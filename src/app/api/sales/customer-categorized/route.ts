import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function POST(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const timeFrameUnit = body.dateFilter?.timeFrameUnit || 0;

    const sales = await prisma.sale.findMany({
      select: { amount: true, date: true, customerName: true },
    });

    // Group by customer type based on timeFrameUnit
    const grouped: Record<number, { type: number; count: number; onDate: string }> = {};
    for (const sale of sales) {
      const type = sale.customerName ? 1 : 2;
      if (!grouped[type]) {
        grouped[type] = { type, count: 0, onDate: "" };
      }
      grouped[type].count += 1;
    }

    return success({
      sales: Object.values(grouped),
    });
  } catch (error) {
    console.error("GetCustomerCategorizedSales error:", error);
    return fail("Error fetching categorized sales", 500);
  }
}
