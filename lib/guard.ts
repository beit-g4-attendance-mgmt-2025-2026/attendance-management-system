import type { NextRequest, NextResponse } from "next/server";
import type { Admin, Role, User } from "@/generated/prisma/client";
import { getUserIdFromRequest } from "@/lib/jwt";
import { prisma } from "./prisma";
import { forbidden, unauthorized } from "./response";

export type GuardResult = { user: User } | { response: NextResponse };
export type GuardAdminOrUser =
	| { admin: Admin }
	| { user: User }
	| { response: NextResponse };

//for user table
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

export async function requireAdminOrUserRoles(
	request: NextRequest,
	roles: Role[],
): Promise<GuardAdminOrUser> {
	const userId = getUserIdFromRequest(request);
	if (!userId) return { response: unauthorized() };

	// check admin table first
	const admin = await prisma.admin.findUnique({ where: { id: userId } });
	if (admin) return { admin };

	// fallback to user
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) return { response: unauthorized() };

	if (roles.length && !roles.includes(user.role)) {
		return { response: forbidden() };
	}

	return { user };
}
