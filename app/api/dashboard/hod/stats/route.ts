import { Gender, Month, Role } from "@/generated/prisma/client";
import { requireAuth } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import type { NextRequest } from "next/server";

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

const monthLabel: Record<Month, string> = {
	[Month.JANUARY]: "Jan",
	[Month.FEBRUARY]: "Feb",
	[Month.MARCH]: "Mar",
	[Month.APRIL]: "Apr",
	[Month.MAY]: "May",
	[Month.JUNE]: "Jun",
	[Month.JULY]: "Jul",
	[Month.AUGUST]: "Aug",
	[Month.SEPTEMBER]: "Sep",
	[Month.OCTOBER]: "Oct",
	[Month.NOVEMBER]: "Nov",
	[Month.DECEMBER]: "Dec",
};
const ROLL_CALL_THRESHOLD = 75;

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
			monthlyAttendanceRaw,
			rollCallStudentsRaw,
			rollCallByStudentRaw,
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
			prisma.dailyAttendance.groupBy({
				by: ["month"],
				where: {
					// Monthly attendance should represent students under this department only.
					student: {
						departmentId: user.departmentId,
					},
					subject: {
						departmentId: user.departmentId,
					},
				},
				_sum: {
					times: true,
					totalTimes: true,
				},
			}),
			prisma.student.findMany({
				where: {
					departmentId: user.departmentId,
				},
				select: {
					id: true,
					rollNo: true,
					name: true,
					year: true,
					semester: true,
					class: {
						select: {
							name: true,
						},
					},
				},
				orderBy: [{ rollNo: "asc" }, { name: "asc" }],
			}),
			prisma.dailyAttendance.groupBy({
				by: ["studentId"],
				where: {
					student: {
						departmentId: user.departmentId,
					},
					subject: {
						departmentId: user.departmentId,
					},
				},
				_sum: {
					times: true,
					totalTimes: true,
				},
			}),
		]);

		const monthlyAttendance = monthOrder.map((month) => {
			const row = monthlyAttendanceRaw.find((item) => item.month === month);
			const present = row?._sum.times ?? 0;
			const totalTimes = row?._sum.totalTimes ?? 0;
			const absent = Math.max(totalTimes - present, 0);

			return {
				month,
				name: monthLabel[month],
				present,
				absent,
			};
		});

		const rollCallByStudentMap = new Map(
			rollCallByStudentRaw.map((row) => [
				row.studentId,
				{
					present: row._sum.times ?? 0,
					total: row._sum.totalTimes ?? 0,
				},
			]),
		);

		const rollCallStudents = rollCallStudentsRaw
			.map((student) => {
				const attendance = rollCallByStudentMap.get(student.id);
				const present = attendance?.present ?? 0;
				const total = attendance?.total ?? 0;
				const rollCallPercent =
					total > 0 ? Number(((present / total) * 100).toFixed(1)) : 0;

				return {
					...student,
					rollCallPercent,
				};
			})
			.filter((student) => student.rollCallPercent < ROLL_CALL_THRESHOLD)
			.sort((a, b) => a.rollCallPercent - b.rollCallPercent);

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
				monthlyAttendance,
				rollCallStudents,
			},
			200,
		);
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}
