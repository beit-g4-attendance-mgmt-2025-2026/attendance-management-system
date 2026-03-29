"use server";

import { Month, Role, type User } from "@/generated/prisma/client";
import { getUserIdFromCookies } from "@/lib/jwt";
import {
	buildMonthlyClassReportData,
	type MonthlyClassReportColumn,
	type MonthlyClassReportData,
	type MonthlyClassReportRow,
	type MonthlyClassReportSubjectCell,
} from "@/lib/report/monthlyClassReport";
import { prisma } from "@/lib/prisma";
import { handleActionErrorResponse } from "@/lib/response";
import { z } from "zod";

const GetMonthlyClassReportSchema = z.object({
	classId: z.string().uuid(),
	month: z.nativeEnum(Month),
});

type GetMonthlyClassReportInput = z.infer<typeof GetMonthlyClassReportSchema>;

export type {
	MonthlyClassReportColumn,
	MonthlyClassReportData,
	MonthlyClassReportRow,
	MonthlyClassReportSubjectCell,
};

export async function GetMonthlyClassReport(
	input: GetMonthlyClassReportInput,
): Promise<{
	success: boolean;
	data?: MonthlyClassReportData;
	message?: string;
	details?: object | null;
}> {
	try {
		const authId = await getUserIdFromCookies();
		if (!authId) return { success: false, message: "Unauthorized" };

		const admin = await prisma.admin.findUnique({ where: { id: authId } });

		let user: User | null = null;
		if (!admin) {
			user = await prisma.user.findUnique({ where: { id: authId } });
			if (!user) return { success: false, message: "Unauthorized" };

			if (user.role !== Role.TEACHER && user.role !== Role.HOD) {
				return { success: false, message: "Forbidden" };
			}
		}

		const validated = GetMonthlyClassReportSchema.parse(input);

		const classRecord = await prisma.class.findFirst({
			where: {
				id: validated.classId,
				...(user?.role === Role.TEACHER ? { userId: user.id } : {}),
				...(user?.role === Role.HOD ? { departmentId: user.departmentId } : {}),
			},
			select: {
				id: true,
				name: true,
				subjects: {
					select: {
						id: true,
						name: true,
						subCode: true,
					},
					orderBy: [{ subCode: "asc" }, { name: "asc" }],
				},
				students: {
					select: {
						id: true,
						name: true,
						rollNo: true,
					},
				},
			},
		});

		if (!classRecord) {
			return {
				success: false,
				message: "Class not found",
			};
		}

		const data = await buildMonthlyClassReportData({
			classId: classRecord.id,
			className: classRecord.name,
			month: validated.month,
			subjects: classRecord.subjects,
			students: classRecord.students,
		});

		return {
			success: true,
			data,
		};
	} catch (error) {
		return handleActionErrorResponse(error);
	}
}
