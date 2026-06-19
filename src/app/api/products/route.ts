import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function POST(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const searchTerm = body.searchTerm || "";
    const pageNumber = body.paggination?.pageNumber || 1;
    const pageSize = body.paggination?.pageSize || 10;

    const where = searchTerm
      ? { name: { contains: searchTerm } }
      : {};

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        include: { sales: { select: { amount: true } } },
      }),
      prisma.product.count({ where }),
    ]);

    return success({
      items: products.map((p) => ({
        productId: p.id,
        productName: p.name,
        detailedType: p.category,
        category: 0,
        priceUnit: p.price,
        totalSale: p.sales.reduce((sum, s) => sum + s.amount, 0),
      })),
      totalCount,
    });
  } catch (error) {
    console.error("GetProducts error:", error);
    return fail("Error fetching products", 500);
  }
}
