import { getUserIdFromRequest } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { toPublicUser } from "@/lib/user";
import { prismaUserRoleToUiRole } from "@/lib/auth-ui";
import {
	handleErrorResponse,
	handleSuccessResponse,
	unauthorized,
} from "@/lib/response";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const userId = getUserIdFromRequest(request);
		if (!userId) return unauthorized();

		const admin = await prisma.admin.findUnique({
			where: { id: userId },
			select: { id: true, username: true, role: true },
		});

		if (admin) {
			return handleSuccessResponse({
				account: "admin" as const,
				uiRole: "admin" as const,
				admin,
				user: null,
			});
		}

		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) return unauthorized();

		return handleSuccessResponse({
			account: "user" as const,
			uiRole: prismaUserRoleToUiRole(user.role),
			admin: null,
			user: toPublicUser(user),
		});
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}
