import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function POST(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const customerIds: string[] = body.customerIds?.ids || [];
    const pageNumber = body.paggination?.pageNumber || 1;
    const pageSize = body.paggination?.pageSize || 10;

    if (customerIds.length === 0) {
      return success({ items: [], totalCount: 0, pageNumber, pageSize });
    }

    const sales = await prisma.sale.findMany({
      where: { customerId: { in: customerIds } },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = await prisma.sale.count({
      where: { customerId: { in: customerIds } },
    });

    const grouped: Record<string, { customerId: string; items: any[] }> = {};
    for (const sale of sales) {
      const cid = sale.customerId || "unknown";
      if (!grouped[cid]) {
        grouped[cid] = { customerId: cid, items: [] };
      }
      grouped[cid].items.push({
        kalaCode: sale.invoiceNumber,
        count: sale.quantity,
        lastSaleDate: sale.date || "",
        price: sale.amount,
      });
    }

    return success({
      items: Object.values(grouped),
      totalCount,
      pageNumber,
      pageSize,
    });
  } catch (error) {
    console.error("GetCustomerSales error:", error);
    return fail("Error fetching customer sales", 500);
  }
}
