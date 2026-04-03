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

const ClearSubjectAttendanceForDateSchema = z.object({
	subjectId: z.string().uuid(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function ClearSubjectAttendanceForDate(input: {
	subjectId: string;
	date: string;
}): Promise<{
	success: boolean;
	data?: {
		deletedCount: number;
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

		const validated = ClearSubjectAttendanceForDateSchema.parse(input);
		const selectedDate = new Date(`${validated.date}T00:00:00`);
		const day = selectedDate.getDate();
		const month = monthOrder[selectedDate.getMonth()];

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

		const deleted = await prisma.dailyAttendance.deleteMany({
			where: {
				subjectId: subject.id,
				day,
				month,
			},
		});

		return {
			success: true,
			data: {
				deletedCount: deleted.count,
				day,
				month,
			},
			message:
				deleted.count > 0
					? "Attendance cleared successfully."
					: "No attendance records found for that date.",
		};
	} catch (error) {
		return handleActionErrorResponse(error);
	}
}
