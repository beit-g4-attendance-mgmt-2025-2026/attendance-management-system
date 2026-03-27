"use server";

import { Gender, Role, type Prisma } from "@/generated/prisma/client";
import { getUserIdFromCookies } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { handleActionErrorResponse } from "@/lib/response";

export type MyClassItem = {
	id: string;
	name: string;
	familyTeacher: string;
	male: number;
	female: number;
	total: number;
};

export async function GetMyClass(params?: { search?: string }): Promise<{
	success: boolean;
	data?: { myClasses: MyClassItem[] };
	message?: string;
	details?: object | null;
}> {
	try {
		const search = params?.search?.trim();

		const authId = await getUserIdFromCookies();
		if (!authId) return { success: false, message: "Unauthorized" };

		const admin = await prisma.admin.findUnique({ where: { id: authId } });
		if (admin) return { success: false, message: "Forbidden" };

		const user = await prisma.user.findUnique({
			where: { id: authId },
			select: {
				id: true,
				fullName: true,
				role: true,
			},
		});
		if (!user) return { success: false, message: "Unauthorized" };
		if (user.role !== Role.TEACHER && user.role !== Role.HOD) {
			return { success: false, message: "Forbidden" };
		}

		const where: Prisma.ClassWhereInput = {
			userId: user.id,
		};
		if (search) {
			where.name = { contains: search, mode: "insensitive" };
		}

		const classes = await prisma.class.findMany({
			where,
			select: {
				id: true,
				name: true,
			},
			orderBy: {
				name: "asc",
			},
		});

		if (classes.length === 0) {
			return {
				success: true,
				data: { myClasses: [] },
			};
		}

		const myClasses = await Promise.all(
			classes.map(async (classRecord) => {
				const [male, female, total] = await Promise.all([
					prisma.student.count({
						where: { classId: classRecord.id, gender: Gender.MALE },
					}),
					prisma.student.count({
						where: {
							classId: classRecord.id,
							gender: Gender.FEMALE,
						},
					}),
					prisma.student.count({
						where: { classId: classRecord.id },
					}),
				]);

				return {
					id: classRecord.id,
					name: classRecord.name,
					familyTeacher: user.fullName,
					male,
					female,
					total,
				};
			}),
		);

		return {
			success: true,
			data: {
				myClasses,
			},
		};
	} catch (error) {
		return handleActionErrorResponse(error);
	}
}
