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
      ? {
          OR: [
            { name: { contains: searchTerm } },
            { phone: { contains: searchTerm } },
          ],
        }
      : {};

    const [customers, totalCount] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        include: { _count: { select: { saleRecords: true } } },
      }),
      prisma.customer.count({ where }),
    ]);

    return success({
      items: customers.map((c) => ({
        id: c.id,
        fullName: c.name,
        isActive: c.status === "active",
        salesCount: c._count.saleRecords,
        place: "",
      })),
      totalCount,
      pageNumber,
      pageSize,
    });
  } catch (error) {
    console.error("GetCustomers error:", error);
    return fail("Error fetching customers", 500);
  }
}
