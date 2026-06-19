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
      ? { OR: [{ productName: { contains: searchTerm } }, { customerName: { contains: searchTerm } }] }
      : {};

    const [sales, totalCount] = await Promise.all([
      prisma.sale.findMany({
        where,
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        orderBy: { date: "desc" },
      }),
      prisma.sale.count({ where }),
    ]);

    return success({
      items: sales.map((s) => ({
        factorNume: 0,
        productDesc: s.productName,
        productCategory: s.category || "",
        deliverdQuantity: s.quantity,
        customerName: s.customerName || "",
        price: s.amount,
        date: s.date || "",
      })),
      totalCount,
      pageNumber,
      pageSize,
    });
  } catch (error) {
    console.error("GetSalesRecords error:", error);
    return fail("Error fetching sales records", 500);
  }
}
