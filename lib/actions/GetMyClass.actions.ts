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

export type MyClassStudentItem = {
	id: string;
	name: string;
	rollNo: string;
	gender: Gender;
	email: string;
	phoneNumber: string;
	year: string;
	semester: string;
};

export type MyClassSubjectItem = {
	id: string;
	name: string;
	subCode: string;
	classId: string;
	className: string;
	teacherId: string;
	teacherName: string;
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
			orderBy: { name: "asc" },
		});

		if (classes.length === 0) {
			return {
				success: true,
				data: { myClasses: [] },
			};
		}

		const classIds = classes.map((c) => c.id);

		const [genderGrouped, totalGrouped] = await Promise.all([
			prisma.student.groupBy({
				by: ["classId", "gender"],
				where: { classId: { in: classIds } },
				_count: { _all: true },
			}),
			prisma.student.groupBy({
				by: ["classId"],
				where: { classId: { in: classIds } },
				_count: { _all: true },
			}),
		]);

		const maleByClass = new Map<string, number>();
		const femaleByClass = new Map<string, number>();
		const totalByClass = new Map<string, number>();

		for (const row of genderGrouped) {
			if (row.gender === Gender.MALE) {
				maleByClass.set(row.classId, row._count._all);
			}
			if (row.gender === Gender.FEMALE) {
				femaleByClass.set(row.classId, row._count._all);
			}
		}

		for (const row of totalGrouped) {
			totalByClass.set(row.classId, row._count._all);
		}

		const myClasses: MyClassItem[] = classes.map((classRecord) => ({
			id: classRecord.id,
			name: classRecord.name,
			familyTeacher: user.fullName,
			male: maleByClass.get(classRecord.id) ?? 0,
			female: femaleByClass.get(classRecord.id) ?? 0,
			total: totalByClass.get(classRecord.id) ?? 0,
		}));

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
