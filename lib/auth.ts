import type { NextRequest } from "next/server";
import type { User } from "@/app/generated/prisma/client";
import { getUserIdFromRequest } from "@/lib/jwt";
import prisma from "./prisma";

export async function getAuthUser(request: NextRequest): Promise<User | null> {
	const userId = getUserIdFromRequest(request);
	if (!userId) return null;

	return prisma.user.findUnique({ where: { id: userId } });
}
