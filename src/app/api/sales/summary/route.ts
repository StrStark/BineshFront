import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function POST(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const sales = await prisma.sale.findMany({
      select: { category: true, amount: true, quantity: true },
    });

    const grouped: Record<string, { type: string; value: number; returned: number }> = {};
    for (const sale of sales) {
      const cat = sale.category || "عمومی";
      if (!grouped[cat]) {
        grouped[cat] = { type: cat, value: 0, returned: 0 };
      }
      grouped[cat].value += sale.amount;
    }

    return success({
      soldItems: Object.values(grouped),
    });
  } catch (error) {
    console.error("GetSalesSummary error:", error);
    return fail("Error fetching sales summary", 500);
  }
}
