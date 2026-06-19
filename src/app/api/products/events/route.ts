import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function POST(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const productIds: string[] = body.listDto?.productIdList || [];
    const pageNumber = body.paggination?.pageNumber || 1;
    const pageSize = body.paggination?.pageSize || 10;

    if (productIds.length === 0) {
      return success({ items: [], totalCount: 0, pageNumber, pageSize });
    }

    const sales = await prisma.sale.findMany({
      where: { productId: { in: productIds } },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      include: { productRel: { select: { stock: true } } },
    });

    const totalCount = await prisma.sale.count({
      where: { productId: { in: productIds } },
    });

    const grouped: Record<string, { productId: string; items: any[]; buy: number; sell: number; stock: number }> = {};
    for (const sale of sales) {
      const pid = sale.productId || "unknown";
      if (!grouped[pid]) {
        grouped[pid] = { productId: pid, items: [], buy: 0, sell: 0, stock: 0 };
      }
      grouped[pid].items.push({
        state: sale.paymentStatus || "",
        date: sale.date || "",
        factorNumber: 0,
        value1: sale.productName,
        value2: sale.customerName || "",
        value3: "",
        price: sale.amount,
        desc: null,
      });
      grouped[pid].sell += sale.quantity;
      grouped[pid].stock = sale.productRel?.stock || 0;
    }

    return success({
      items: Object.values(grouped),
      totalCount,
      pageNumber,
      pageSize,
    });
  } catch (error) {
    console.error("GetProductEvents error:", error);
    return fail("Error fetching product events", 500);
  }
}
