"use server";

import { Role } from "@/generated/prisma/client";
import { getUserIdFromCookies } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { handleActionErrorResponse } from "@/lib/response";

export async function GetMySubjectById(subjectId: string): Promise<{
	success: boolean;
	data?: {
		id: string;
		name: string;
		subCode: string;
		classId: string;
		className: string;
		academicYearId: string | null;
		academicYearName: string | null;
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

		const subject = await prisma.subject.findFirst({
			where: {
				id: subjectId,
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
						academicYearId: true,
						academicYear: {
							select: {
								name: true,
							},
						},
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

		return {
			success: true,
			data: {
				id: subject.id,
				name: subject.name,
				subCode: subject.subCode,
				classId: subject.classId,
				className: subject.class.name,
				academicYearId: subject.class.academicYearId,
				academicYearName: subject.class.academicYear?.name ?? null,
				students: subject.class.students.map((student) => ({
					id: student.id,
					name: student.name,
					rollNo: student.rollNo,
					isPresent: false,
				})),
			},
		};
	} catch (error) {
		return handleActionErrorResponse(error);
	}
}
