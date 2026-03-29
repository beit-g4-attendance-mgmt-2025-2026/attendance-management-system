"use server";

import { Role } from "@/generated/prisma/client";
import { getUserIdFromCookies } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GetCurrentUserRole(): Promise<{
	success: boolean;
	data?: {
		role: Role | "ADMIN";
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
			data: { role: "ADMIN" },
		};
	}

	const user = await prisma.user.findUnique({
		where: { id: authId },
		select: { role: true },
	});
	if (!user) return { success: false, message: "Unauthorized" };

	return {
		success: true,
		data: { role: user.role },
	};
}
