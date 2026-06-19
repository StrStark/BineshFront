import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, lastName, mobile, position, role, status, title } = body;

    const existing = await prisma.account.findUnique({ where: { id } });
    if (!existing) {
      return fail("User not found", 404);
    }

    if (mobile && mobile !== existing.username) {
      const duplicate = await prisma.account.findUnique({
        where: { username: mobile },
      });
      if (duplicate) {
        return fail("User with this mobile already exists", 409);
      }
    }

    const account = await prisma.account.update({
      where: { id },
      data: {
        username: mobile !== undefined ? mobile : undefined,
        name: name !== undefined ? `${name} ${lastName || ""}`.trim() : undefined,
        position: position !== undefined ? position : undefined,
        role: role !== undefined ? role : undefined,
        status: status !== undefined ? status : undefined,
        title: title !== undefined ? title : undefined,
      },
    });

    return success({
      id: account.id,
      name: account.name.split(" ")[0] || "",
      lastName: account.name.split(" ").slice(1).join(" ") || "",
      mobile: account.username,
      position: account.position || "",
      role: account.role,
      status: account.status || "active",
      lastLogin: account.lastLogin || "",
      title: account.title || "",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return fail("Error updating user", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;

    const existing = await prisma.account.findUnique({ where: { id } });
    if (!existing) {
      return fail("User not found", 404);
    }

    if (existing.id === session!.userId) {
      return fail("Cannot delete yourself", 400);
    }

    await prisma.account.delete({ where: { id } });

    return success(null, "User deleted");
  } catch (error) {
    console.error("Error deleting user:", error);
    return fail("Error deleting user", 500);
  }
}
