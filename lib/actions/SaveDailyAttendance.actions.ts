"use server";

import { Month, Role } from "@/generated/prisma/client";
import { getUserIdFromCookies } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { handleActionErrorResponse } from "@/lib/response";
import { z } from "zod";

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

const SaveDailyAttendanceSchema = z.object({
	subjectId: z.string().uuid(),
	totalTimes: z.coerce.number().int().positive(),
	day: z.coerce.number().int().min(1).max(31).optional(),
	month: z.nativeEnum(Month).optional(),
	attendance: z
		.array(
			z.object({
				studentId: z.string().uuid(),
				status: z.enum(["present", "absent"]),
			}),
		)
		.min(1),
});

type SaveDailyAttendanceInput = z.infer<typeof SaveDailyAttendanceSchema>;

export async function SaveDailyAttendance(
	input: SaveDailyAttendanceInput,
): Promise<{
	success: boolean;
	data?: {
		savedCount: number;
		classId: string;
		subjectId: string;
		day: number;
		month: Month;
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

		const validated = SaveDailyAttendanceSchema.parse(input);
		const studentIds = validated.attendance.map(({ studentId }) => studentId);
		const uniqueStudentIds = [...new Set(studentIds)];
		if (uniqueStudentIds.length !== studentIds.length) {
			return {
				success: false,
				message: "Duplicate student IDs are not allowed",
			};
		}

		const today = new Date();
		const day = validated.day ?? today.getDate();
		const month = validated.month ?? monthOrder[today.getMonth()];

		const result = await prisma.$transaction(async (tx) => {
			const students = await tx.student.findMany({
				where: { id: { in: uniqueStudentIds } },
				select: { id: true, classId: true },
			});

			if (students.length !== uniqueStudentIds.length) {
				throw new Error("Some students were not found");
			}

			const classIds = [...new Set(students.map(({ classId }) => classId))];
			if (classIds.length !== 1) {
				throw new Error("All students must belong to the same class");
			}

			const [classId] = classIds;

			// Narrow `any` bridges the period before `prisma generate` is run for
			// the new Subject<->Class and DailyAttendance.classId schema changes.
			const subject = await (tx.subject.findFirst as any)({
				where: {
					id: validated.subjectId,
					userId: user.id,
					classes: {
						some: { id: classId },
					},
				},
				select: { id: true },
			});

			if (!subject) {
				throw new Error("Subject not found for this teacher and class");
			}

			await (tx.dailyAttendance.deleteMany as any)({
				where: {
					studentId: { in: uniqueStudentIds },
					subjectId: validated.subjectId,
					classId,
					day,
					month,
				},
			});

			const created = await (tx.dailyAttendance.createMany as any)({
				data: validated.attendance.map(({ studentId, status }) => ({
					studentId,
					subjectId: validated.subjectId,
					classId,
					day,
					month,
					totalTimes: validated.totalTimes,
					times: status === "present" ? validated.totalTimes : 0,
				})),
			});

			return {
				savedCount: created.count,
				classId,
			};
		});

		return {
			success: true,
			data: {
				savedCount: result.savedCount,
				classId: result.classId,
				subjectId: validated.subjectId,
				day,
				month,
			},
		};
	} catch (error) {
		return handleActionErrorResponse(error);
	}
}
