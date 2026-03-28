import { Gender, Role } from "@/generated/prisma/client";
import { requireAuth } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const auth = await requireAuth(request, {
			roles: [Role.HOD, Role.TEACHER],
		});
		if ("response" in auth) return auth.response;

		const user = auth.user;
		if (!user.departmentId) {
			throw new Error("Department not found for HOD");
		}

		const [
			studentsCount,
			teachersCount,
			subjectsCount,
			maleStudentsCount,
			femaleStudentsCount,
			otherStudentsCount,
		] = await Promise.all([
			prisma.student.count({
				where: { departmentId: user.departmentId },
			}),
			prisma.user.count({
				where: {
					departmentId: user.departmentId,
					role: Role.TEACHER,
				},
			}),
			prisma.subject.count({
				where: { departmentId: user.departmentId },
			}),
			prisma.student.count({
				where: { departmentId: user.departmentId, gender: Gender.MALE },
			}),
			prisma.student.count({
				where: {
					departmentId: user.departmentId,
					gender: Gender.FEMALE,
				},
			}),
			prisma.student.count({
				where: {
					departmentId: user.departmentId,
					gender: Gender.OTHER,
				},
			}),
		]);

		return handleSuccessResponse(
			{
				stats: {
					students: studentsCount,
					teachers: teachersCount,
					subjects: subjectsCount,
					maleStudents: maleStudentsCount,
					femaleStudents: femaleStudentsCount,
					otherStudents: otherStudentsCount,
				},
			},
			200,
		);
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}
