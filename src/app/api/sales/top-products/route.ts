import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function POST(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const grouped = await prisma.sale.groupBy({
      by: ["productName"],
      _sum: { amount: true, quantity: true },
      orderBy: { _sum: { amount: "desc" } },
      take: 5,
    });

    return success({
      items: grouped.map((g, i) => ({
        rank: i + 1,
        productName: g.productName,
        count: g._sum.quantity || 0,
        totalAmount: g._sum.amount || 0,
        growth: 0,
      })),
    });
  } catch (error) {
    console.error("GetTopSellingProducts error:", error);
    return fail("Error fetching top products", 500);
  }
}
