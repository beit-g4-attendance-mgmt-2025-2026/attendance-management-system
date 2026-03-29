"use server";

import { Role } from "@/generated/prisma/client";
import { getUserIdFromCookies } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { handleActionErrorResponse } from "@/lib/response";
import { z } from "zod";

const AttendanceStudentQuerySchema = z.object({
	classId: z.string().uuid(),
	subjectId: z.string().uuid(),
	academicYearId: z.string().uuid().optional(),
});

export async function GetAttendanceSelectionData(): Promise<{
	success: boolean;
	data?: {
		classes: {
			id: string;
			name: string;
			academicYearId: string | null;
			academicYearName: string | null;
		}[];
		subjects: {
			id: string;
			name: string;
			subCode: string;
			classId: string;
			className: string;
			academicYearId: string | null;
		}[];
		academicYears: {
			id: string;
			name: string;
			isActive: boolean;
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

		const [subjects, academicYears] = await Promise.all([
			prisma.subject.findMany({
				where: { userId: user.id },
				select: {
					id: true,
					name: true,
					subCode: true,
					classId: true,
					class: {
						select: {
							id: true,
							name: true,
							academicYearId: true,
							academicYear: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
				},
				orderBy: [{ name: "asc" }],
			}),
			prisma.academicYear.findMany({
				select: {
					id: true,
					name: true,
					isActive: true,
				},
				orderBy: [{ startDate: "desc" }],
			}),
		]);

		const classes = Array.from(
			new Map(
				subjects.map((subject) => [
					subject.class.id,
					{
						id: subject.class.id,
						name: subject.class.name,
						academicYearId: subject.class.academicYearId,
						academicYearName: subject.class.academicYear?.name ?? null,
					},
				]),
			).values(),
		).sort((left, right) => left.name.localeCompare(right.name));

		return {
			success: true,
			data: {
				classes,
				subjects: subjects.map((subject) => ({
					id: subject.id,
					name: subject.name,
					subCode: subject.subCode,
					classId: subject.classId,
					className: subject.class.name,
					academicYearId: subject.class.academicYearId,
				})),
				academicYears,
			},
		};
	} catch (error) {
		return handleActionErrorResponse(error);
	}
}

export async function GetAttendanceStudentsForSelection(input: {
	classId: string;
	subjectId: string;
	academicYearId?: string;
}): Promise<{
	success: boolean;
	data?: {
		students: {
			id: string;
			rollNo: string;
			name: string;
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

		const validated = AttendanceStudentQuerySchema.parse(input);

		const subject = await prisma.subject.findFirst({
			where: {
				id: validated.subjectId,
				userId: user.id,
				classId: validated.classId,
				...(validated.academicYearId
					? {
							class: {
								academicYearId: validated.academicYearId,
							},
						}
					: {}),
			},
			select: { id: true },
		});

		if (!subject) {
			return {
				success: false,
				message: "Subject not found for the selected class and academic year",
			};
		}

		const students = await prisma.student.findMany({
			where: { classId: validated.classId },
			select: {
				id: true,
				rollNo: true,
				name: true,
			},
			orderBy: [{ rollNo: "asc" }, { name: "asc" }],
		});

		return {
			success: true,
			data: {
				students: students.map((student) => ({
					id: student.id,
					rollNo: student.rollNo,
					name: student.name,
					isPresent: false,
				})),
			},
		};
	} catch (error) {
		return handleActionErrorResponse(error);
	}
}
