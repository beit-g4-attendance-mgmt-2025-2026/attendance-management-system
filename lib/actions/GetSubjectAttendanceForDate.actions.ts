"use server";

import { Month, Role } from "@/generated/prisma/client";
import { getUserIdFromCookies } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { handleActionErrorResponse } from "@/lib/response";
import { z } from "zod";

const GetSubjectAttendanceForDateSchema = z.object({
	subjectId: z.string().uuid(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const monthOrder: Month[] = [
	Month.JANUARY,
	Month.FEBRUARY,
	Month.MARCH,
	Month.APRIL,
	Month.MAY,
	Month.JUNE,
	Month.JULY,
	Month.AUGUST,
	Month.SEPTEMBER,
	Month.OCTOBER,
	Month.NOVEMBER,
	Month.DECEMBER,
];

export async function GetSubjectAttendanceForDate(input: {
	subjectId: string;
	date: string;
}): Promise<{
	success: boolean;
	data?: {
		subject: {
			id: string;
			name: string;
			subCode: string;
			classId: string;
			className: string;
		};
		date: string;
		day: number;
		month: Month;
		totalTimes: number;
		hasSavedAttendance: boolean;
		savedCount: number;
		students: {
			id: string;
			name: string;
			rollNo: string;
			isPresent: boolean;
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

		const validated = GetSubjectAttendanceForDateSchema.parse(input);
		const selectedDate = new Date(`${validated.date}T00:00:00`);
		const day = selectedDate.getDate();
		const month = monthOrder[selectedDate.getMonth()];

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

		const existingAttendance = await prisma.dailyAttendance.findMany({
			where: {
				subjectId: subject.id,
				day,
				month,
			},
			select: {
				studentId: true,
				times: true,
				totalTimes: true,
			},
		});

		const attendanceByStudent = new Map(
			existingAttendance.map((item) => [
				item.studentId,
				{ isPresent: item.times > 0, totalTimes: item.totalTimes },
			]),
		);

		return {
			success: true,
			data: {
				subject: {
					id: subject.id,
					name: subject.name,
					subCode: subject.subCode,
					classId: subject.classId,
					className: subject.class.name,
				},
				date: validated.date,
				day,
				month,
				totalTimes: existingAttendance[0]?.totalTimes ?? 1,
				hasSavedAttendance: existingAttendance.length > 0,
				savedCount: existingAttendance.length,
				students: [...subject.class.students]
					.sort(
						(left, right) =>
							left.rollNo.localeCompare(right.rollNo, undefined, {
								numeric: true,
								sensitivity: "base",
							}) || left.name.localeCompare(right.name),
					)
					.map((student) => ({
						id: student.id,
						name: student.name,
						rollNo: student.rollNo,
						isPresent:
							attendanceByStudent.get(student.id)?.isPresent ?? false,
					})),
			},
		};
	} catch (error) {
		return handleActionErrorResponse(error);
	}
}
