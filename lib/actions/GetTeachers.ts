"use server";

import { prisma } from "@/lib/prisma";
import validateBody from "@/lib/validateBody";
import { handleActionErrorResponse } from "@/lib/response";
import { toPublicUser } from "@/lib/user";
import { Role, type Prisma, type User } from "@/generated/prisma/client";
import PaginatedSearchParamsSchema from "../schema/PaginatedSearchParamsSchema";
import { TeacherWithDepartment } from "@/app/(protected)/(admin)/teachers/page";
import { cookies } from "next/headers";
import { getUserIdFromCookies } from "../jwt";

export async function GetTeachers(params: {
	page?: number;
	pageSize?: number;
	search?: string;
	filter?: string;
}): Promise<{
	success: boolean;
	data?: {
		teachers: TeacherWithDepartment[];
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

		const where: Prisma.UserWhereInput = {};

		if (search) {
			where.OR = [
				{ fullName: { contains: search, mode: "insensitive" } },
				{ username: { contains: search, mode: "insensitive" } },
				{ email: { contains: search, mode: "insensitive" } },
				{ phoneNumber: { contains: search, mode: "insensitive" } },
			];
		}

		// if (filter && ["ADMIN", "HOD", "TEACHER"].includes(filter)) {
		// 	where.role = filter as any;
		// }

		if (filter) {
			where.department = { symbol: filter };
		}

		//  HOD restriction
		if (user?.role === Role.HOD) {
			if (!user.departmentId) {
				return { success: false, message: "HOD has no department" };
			}
			where.departmentId = user.departmentId;
		}

		const total = await prisma.user.count({ where });

		const users = await prisma.user.findMany({
			where,
			include: { department: true },
			skip,
			take,
		});
		const teachers = users.map(
			({
				password,
				resetPasswordToken,
				resetPasswordExpireAt,
				...rest
			}) => rest,
		);
		const isNext = total > skip + teachers.length;

		return {
			success: true,
			data: { teachers, isNext, total },
		};
	} catch (error) {
		return handleActionErrorResponse(error);
	}
}
