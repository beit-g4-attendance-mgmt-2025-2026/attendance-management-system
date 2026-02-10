import type { NextRequest, NextResponse } from "next/server";
import type { Role, User } from "@/generated/prisma/client";
import { getUserIdFromRequest } from "@/lib/jwt";
import { prisma } from "./prisma";
import { forbidden, unauthorized } from "./response";

export type GuardResult = { user: User } | { response: NextResponse };

export async function requireAuth(
  request: NextRequest,
  options?: { roles?: Role[] },
): Promise<GuardResult> {
  const userId = getUserIdFromRequest(request);
  if (!userId) return { response: unauthorized() };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { response: unauthorized() };

  if (options?.roles && !options.roles.includes(user.role)) {
    return { response: forbidden() };
  }

  return { user };
}
