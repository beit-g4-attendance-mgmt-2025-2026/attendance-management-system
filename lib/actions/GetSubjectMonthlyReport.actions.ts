"use server";

import { Month, Role } from "@/generated/prisma/client";
import { getUserIdFromCookies } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { handleActionErrorResponse } from "@/lib/response";
import { z } from "zod";

const GetSubjectMonthlyReportSchema = z.object({
	subjectId: z.string().uuid(),
	month: z.nativeEnum(Month),
});

export async function GetSubjectMonthlyReport(input: {
	subjectId: string;
	month: Month;
}): Promise<{
	success: boolean;
	data?: {
		subjectId: string;
		subjectName: string;
		subjectCode: string;
		className: string;
		month: Month;
		takenDays: number[];
		monthlyTotalTimes: number;
		totalPresentTimes: number;
		totalPossibleTimes: number;
		overallPercentage: number;
		rows: {
			studentId: string;
			rollNo: string;
			name: string;
			presentTimes: number;
			totalTimes: number;
			percentage: number;
		}[];
	};
	message?: string;
	details?: object | null;
}> {
	try {
		const authId = await getUserIdFromCookies();
		if (!authId) return { success: false, message: "Unauthorized" };

		const admin = await prisma.admin.findUnique({ where: { id: authId } });
		if (admin) return { success: false, message: "Forbidden" };

		const user = await prisma.user.findUnique({
			where: { id: authId },
			select: { id: true, role: true },
		});
		if (!user) return { success: false, message: "Unauthorized" };
		if (user.role !== Role.TEACHER && user.role !== Role.HOD) {
			return { success: false, message: "Forbidden" };
		}

		const validated = GetSubjectMonthlyReportSchema.parse(input);

		const subject = await prisma.subject.findFirst({
			where: {
				id: validated.subjectId,
				userId: user.id,
			},
			select: {
				id: true,
				name: true,
				subCode: true,
				classId: true,
				class: {
					select: {
						name: true,
						students: {
							select: {
								id: true,
								name: true,
								rollNo: true,
							},
							orderBy: [{ rollNo: "asc" }, { name: "asc" }],
						},
					},
				},
			},
		});

		if (!subject) {
			return { success: false, message: "Subject not found" };
		}

		const attendance = await prisma.dailyAttendance.findMany({
			where: {
				subjectId: validated.subjectId,
				month: validated.month,
			},
			select: {
				day: true,
				studentId: true,
				times: true,
				totalTimes: true,
			},
		});

		const totalTimesByDay = new Map<number, number>();
		for (const item of attendance) {
			if (!totalTimesByDay.has(item.day)) {
				totalTimesByDay.set(item.day, item.totalTimes);
			}
		}

		const totalsByStudent = new Map<
			string,
			{ presentTimes: number; totalTimes: number }
		>();

		for (const item of attendance) {
			const current = totalsByStudent.get(item.studentId) ?? {
				presentTimes: 0,
				totalTimes: 0,
			};
			current.presentTimes += item.times;
			current.totalTimes += item.totalTimes;
			totalsByStudent.set(item.studentId, current);
		}

		const takenDays = [...new Set(attendance.map((item) => item.day))].sort(
			(left, right) => left - right,
		);
		const monthlyTotalTimes = Array.from(totalTimesByDay.values()).reduce(
			(sum, totalTimes) => sum + totalTimes,
			0,
		);

		const rows = subject.class.students.map((student) => {
			const totals = totalsByStudent.get(student.id) ?? {
				presentTimes: 0,
				totalTimes: 0,
			};
			const percentage =
				totals.totalTimes > 0
					? Number(((totals.presentTimes / totals.totalTimes) * 100).toFixed(1))
					: 0;

			return {
				studentId: student.id,
				rollNo: student.rollNo,
				name: student.name,
				presentTimes: totals.presentTimes,
				totalTimes: totals.totalTimes,
				percentage,
			};
		}).sort(
			(left, right) =>
				left.rollNo.localeCompare(right.rollNo, undefined, {
					numeric: true,
					sensitivity: "base",
				}) || left.name.localeCompare(right.name),
		);

		const totalPresentTimes = rows.reduce(
			(sum, row) => sum + row.presentTimes,
			0,
		);
		const totalPossibleTimes = rows.reduce(
			(sum, row) => sum + row.totalTimes,
			0,
		);
		const overallPercentage =
			totalPossibleTimes > 0
				? Number(((totalPresentTimes / totalPossibleTimes) * 100).toFixed(1))
				: 0;

		return {
			success: true,
			data: {
				subjectId: subject.id,
				subjectName: subject.name,
				subjectCode: subject.subCode,
				className: subject.class.name,
				month: validated.month,
				takenDays,
				monthlyTotalTimes,
				totalPresentTimes,
				totalPossibleTimes,
				overallPercentage,
				rows,
			},
		};
	} catch (error) {
		return handleActionErrorResponse(error);
	}
}
