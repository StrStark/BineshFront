import { NextRequest } from "next/server";
import { getServerSession } from "./auth";
import { fail } from "./response";

export async function requireAuth(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return { session: null, errorResponse: fail("Unauthorized", 401) };
  }

  return { session, errorResponse: null };
}
