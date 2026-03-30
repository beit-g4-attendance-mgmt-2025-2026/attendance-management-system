"use server";

import { Role } from "@/generated/prisma/client";
import { getUserIdFromCookies } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GetCurrentUserRole(): Promise<{
	success: boolean;
	data?: {
		role: Role | "ADMIN";
		departmentSymbol?: string | null;
	};
	message?: string;
}> {
	const authId = await getUserIdFromCookies();
	if (!authId) return { success: false, message: "Unauthorized" };

	const admin = await prisma.admin.findUnique({
		where: { id: authId },
		select: { id: true },
	});
	if (admin) {
		return {
			success: true,
			data: { role: "ADMIN", departmentSymbol: null },
		};
	}

	const user = await prisma.user.findUnique({
		where: { id: authId },
		select: {
			role: true,
			department: {
				select: {
					symbol: true,
				},
			},
		},
	});
	if (!user) return { success: false, message: "Unauthorized" };

	return {
		success: true,
		data: {
			role: user.role,
			departmentSymbol: user.department?.symbol ?? null,
		},
	};
}
