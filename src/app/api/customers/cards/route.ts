import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function POST(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [totalCustomers, activeCustomers, previousCustomers, totalSales, previousSales] =
      await Promise.all([
        prisma.customer.count(),
        prisma.customer.count({ where: { status: "active" } }),
        prisma.customer.count({
          where: { createdAt: { lt: thirtyDaysAgo, gte: sixtyDaysAgo } },
        }),
        prisma.sale.aggregate({ _sum: { amount: true } }),
        prisma.sale.aggregate({
          _sum: { amount: true },
          where: { createdAt: { lt: thirtyDaysAgo, gte: sixtyDaysAgo } },
        }),
      ]);

    const calcGrowth = (current: number, prev: number) =>
      prev > 0 ? Math.round(((current - prev) / prev) * 100) / 100 : 0;

    const arpuValue = totalCustomers > 0 ? (totalSales._sum.amount || 0) / totalCustomers : 0;
    const prevArpu =
      previousCustomers > 0 ? (previousSales._sum.amount || 0) / previousCustomers : 0;

    const crrValue = totalCustomers > 0
      ? Math.round((activeCustomers / totalCustomers) * 10000) / 100
      : 0;

    const prevCrr = 0;

    return success({
      arpu: { value: Math.round(arpuValue), growth: calcGrowth(arpuValue, prevArpu) },
      crr: { value: crrValue, growth: calcGrowth(crrValue, prevCrr) },
      totalCustomers,
      activeCustomers,
    });
  } catch (error) {
    console.error("GetCustomersCards error:", error);
    return fail("Error fetching customer cards", 500);
  }
}
