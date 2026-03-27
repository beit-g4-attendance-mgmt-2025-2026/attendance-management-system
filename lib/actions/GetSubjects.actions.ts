"use server";

import { prisma } from "@/lib/prisma";
import validateBody from "@/lib/validateBody";
import { handleActionErrorResponse } from "@/lib/response";
import { Role, type Prisma, type User } from "@/generated/prisma/client";
import PaginatedSearchParamsSchema from "../schema/PaginatedSearchParamsSchema";
import { getUserIdFromCookies } from "../jwt";

const subjectWithDetailsArgs = {
	include: {
		user: {
			select: {
				fullName: true,
			},
		},
		class: {
			select: { semester: true, year: true },
		},
	},
} satisfies Prisma.SubjectDefaultArgs;

export type SubjectWithDetails = Prisma.SubjectGetPayload<
	typeof subjectWithDetailsArgs
>;
export async function GetSubjects(params: {
	page?: number;
	pageSize?: number;
	search?: string;
	filter?: string;
}): Promise<{
	success: boolean;
	data?: {
		subjects: SubjectWithDetails[];
		isNext: boolean;
		total?: number;
	};
	message?: string;
	details?: object | null;
}> {
	try {
		// Auth from cookies (Admin OR User)
		const authId = await getUserIdFromCookies();
		if (!authId) return { success: false, message: "Unauthorized" };

		// check Admin table first
		const admin = await prisma.admin.findUnique({ where: { id: authId } });

		// if not admin, check User table
		let user: User | null = null;
		if (!admin) {
			user = await prisma.user.findUnique({ where: { id: authId } });
			if (!user) return { success: false, message: "Unauthorized" };

			if (user.role !== Role.ADMIN && user.role !== Role.HOD) {
				return { success: false, message: "Forbidden" };
			}
		}

		const validated = validateBody(params, PaginatedSearchParamsSchema);
		const { page = 1, pageSize = 10, search, filter } = validated.data;

		const skip = (Number(page) - 1) * Number(pageSize);
		const take = Number(pageSize);

		const where: Prisma.SubjectWhereInput = {};

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ subCode: { contains: search, mode: "insensitive" } },
				{
					user: {
						fullName: { contains: search, mode: "insensitive" },
					},
				},
			];
		}

		if (filter) {
			where.department = { symbol: filter };
		}

		// HOD restriction - only see subjects in their department
		if (user?.role === Role.HOD) {
			if (!user.departmentId) {
				return { success: false, message: "HOD has no department" };
			}
			where.departmentId = user.departmentId;
		}

		const total = await prisma.subject.count({ where });

		const subjects = await prisma.subject.findMany({
			where,
			include: {
				// department: {
				// 	select: { id: true, name: true, symbol: true },
				// },
				user: {
					select: {
						id: true,
						fullName: true,
					},
				},
				class: {
					select: {
						id: true,
						// name: true,
						semester: true,
						year: true,
					},
				},
			},
			skip,
			take,
			orderBy: { name: "asc" },
		});

		const isNext = total > skip + subjects.length;

		// Transform subjects to match table format

		return {
			success: true,
			data: { subjects, isNext, total },
		};
	} catch (error) {
		return handleActionErrorResponse(error);
	}
}
