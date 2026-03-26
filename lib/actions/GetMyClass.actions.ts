"use server";

import { Gender, Role } from "@/generated/prisma/client";
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
	data?: { myClass: MyClassItem | null };
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

		const classRecord = await prisma.class.findFirst({
			where: { userId: user.id },
			select: {
				id: true,
				name: true,
			},
		});

		if (!classRecord) {
			return {
				success: true,
				data: { myClass: null },
			};
		}

		if (
			search &&
			!classRecord.name.toLowerCase().includes(search.toLowerCase())
		) {
			return {
				success: true,
				data: { myClass: null },
			};
		}

		const [male, female, total] = await Promise.all([
			prisma.student.count({
				where: { classId: classRecord.id, gender: Gender.MALE },
			}),
			prisma.student.count({
				where: { classId: classRecord.id, gender: Gender.FEMALE },
			}),
			prisma.student.count({
				where: { classId: classRecord.id },
			}),
		]);

		return {
			success: true,
			data: {
				myClass: {
					id: classRecord.id,
					name: classRecord.name,
					familyTeacher: user.fullName,
					male,
					female,
					total,
				},
			},
		};
	} catch (error) {
		return handleActionErrorResponse(error);
	}
}
