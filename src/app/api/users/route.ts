import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function GET(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const accounts = await prisma.account.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { sessions: true } } },
    });

    const users = accounts.map((acc) => ({
      id: acc.id,
      name: acc.name.split(" ")[0] || "",
      lastName: acc.name.split(" ").slice(1).join(" ") || "",
      mobile: acc.username,
      position: acc.position || "",
      role: acc.role,
      status: acc.status || "active",
      lastLogin: acc.lastLogin || "",
      title: acc.title || "",
    }));

    return success({ items: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return fail("Error fetching users", 500);
  }
}

export async function POST(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { name, lastName, mobile, position, role } = body;

    if (!name || !mobile) {
      return fail("Name and mobile are required", 400);
    }

    const existing = await prisma.account.findUnique({
      where: { username: mobile },
    });
    if (existing) {
      return fail("User with this mobile already exists", 409);
    }

    const account = await prisma.account.create({
      data: {
        username: mobile,
        password: "",
        name: `${name} ${lastName || ""}`.trim(),
        role: role || "user",
        position: position || null,
        status: "active",
      },
    });

    return success({
      id: account.id,
      name: name,
      lastName: lastName || "",
      mobile: account.username,
      position: account.position || "",
      role: account.role,
      status: account.status,
      lastLogin: "",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return fail("Error creating user", 500);
  }
}
