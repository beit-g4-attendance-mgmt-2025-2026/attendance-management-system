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

const MoveSubjectAttendanceDateSchema = z
	.object({
		subjectId: z.string().uuid(),
		fromDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
		toDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	})
	.refine((data) => data.fromDate !== data.toDate, {
		message: "Please choose a different target date",
		path: ["toDate"],
	});

export async function MoveSubjectAttendanceDate(input: {
	subjectId: string;
	fromDate: string;
	toDate: string;
}): Promise<{
	success: boolean;
	data?: {
		movedCount: number;
		fromDay: number;
		fromMonth: Month;
		toDay: number;
		toMonth: Month;
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

		const validated = MoveSubjectAttendanceDateSchema.parse(input);
		const fromDate = new Date(`${validated.fromDate}T00:00:00`);
		const toDate = new Date(`${validated.toDate}T00:00:00`);
		const fromDay = fromDate.getDate();
		const fromMonth = monthOrder[fromDate.getMonth()];
		const toDay = toDate.getDate();
		const toMonth = monthOrder[toDate.getMonth()];

		const subject = await prisma.subject.findFirst({
			where: {
				id: validated.subjectId,
				userId: user.id,
			},
			select: { id: true },
		});

		if (!subject) {
			return { success: false, message: "Subject not found" };
		}

		const result = await prisma.$transaction(async (tx) => {
			const sourceRecords = await tx.dailyAttendance.findMany({
				where: {
					subjectId: subject.id,
					day: fromDay,
					month: fromMonth,
				},
				select: {
					id: true,
					studentId: true,
				},
			});

			if (sourceRecords.length === 0) {
				throw new Error("No saved attendance found on the selected date");
			}

			const targetRecords = await tx.dailyAttendance.count({
				where: {
					subjectId: subject.id,
					day: toDay,
					month: toMonth,
				},
			});

			if (targetRecords > 0) {
				throw new Error(
					"Attendance already exists on the target date. Clear that date first before moving records.",
				);
			}

			const updated = await tx.dailyAttendance.updateMany({
				where: {
					id: { in: sourceRecords.map((record) => record.id) },
				},
				data: {
					day: toDay,
					month: toMonth,
				},
			});

			return updated.count;
		});

		return {
			success: true,
			data: {
				movedCount: result,
				fromDay,
				fromMonth,
				toDay,
				toMonth,
			},
			message: "Attendance date updated successfully.",
		};
	} catch (error) {
		return handleActionErrorResponse(error);
	}
}
