"use server";

import { Month, Role, type User } from "@/generated/prisma/client";
import { getUserIdFromCookies } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { handleActionErrorResponse } from "@/lib/response";
import { z } from "zod";

const GetMonthlyClassReportSchema = z.object({
	classId: z.string().uuid(),
	month: z.nativeEnum(Month),
});

type GetMonthlyClassReportInput = z.infer<typeof GetMonthlyClassReportSchema>;

export type MonthlyClassReportColumn = {
	subjectId: string;
	subjectName: string;
	subjectCode: string;
};

export type MonthlyClassReportSubjectCell = {
	subjectId: string;
	subjectName: string;
	subjectCode: string;
	times: number;
	totalTimes: number;
	status: boolean;
	monthlySubAttendanceId: string | null;
};

export type MonthlyClassReportRow = {
	studentId: string;
	studentName: string;
	rollNo: string;
	monthlyClassAttendanceId: string | null;
	totalTimes: number;
	status: boolean;
	subjects: Record<string, MonthlyClassReportSubjectCell>;
};

export async function GetMonthlyClassReport(
	input: GetMonthlyClassReportInput,
): Promise<{
	success: boolean;
	data?: {
		classId: string;
		className: string;
		month: Month;
		columns: MonthlyClassReportColumn[];
		rows: MonthlyClassReportRow[];
	};
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
				academicYearId: true,
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

		const columns: MonthlyClassReportColumn[] = classRecord.subjects.map(
			(subject) => ({
				subjectId: subject.id,
				subjectName: subject.name,
				subjectCode: subject.subCode,
			}),
		);

		type MonthlyJoinedRow = {
			monthlyClassAttendanceId: string;
			monthlyClassTotalTimes: number;
			monthlyClassStatus: boolean;
			studentId: string;
			monthlySubAttendanceId: string;
			subjectId: string;
			times: number;
			totalTimes: number;
			status: boolean;
			subjectName: string;
			subjectCode: string;
		};

		const monthlyJoinedRows = await prisma.$queryRawUnsafe<MonthlyJoinedRow[]>(
			`
			SELECT
				mca."id" AS "monthlyClassAttendanceId",
				mca."totalTimes" AS "monthlyClassTotalTimes",
				mca."status" AS "monthlyClassStatus",
				msa."studentId" AS "studentId",
				msa."id" AS "monthlySubAttendanceId",
				msa."subjectId" AS "subjectId",
				msa."times" AS "times",
				msa."totalTimes" AS "totalTimes",
				msa."status" AS "status",
				s."name" AS "subjectName",
				s."subCode" AS "subjectCode"
			FROM "MonthlySubAttendance" msa
			INNER JOIN "MonthlyClassAttendance" mca
				ON mca."id" = msa."monthlyClassAttendanceId"
			INNER JOIN "Subject" s
				ON s."id" = msa."subjectId"
			WHERE mca."classId" = $1::uuid
			ORDER BY s."subCode" ASC, s."name" ASC
			`,
			validated.classId,
		);

		const monthlyByStudent = new Map<
			string,
			{
				id: string;
				totalTimes: number;
				status: boolean;
				monthlySubAttendance: Array<{
					id: string;
					subjectId: string;
					times: number;
					totalTimes: number;
					status: boolean;
					subject: {
						name: string;
						subCode: string;
					};
				}>;
			}
		>();

		for (const row of monthlyJoinedRows) {
			const current = monthlyByStudent.get(row.studentId) ?? {
				id: row.monthlyClassAttendanceId,
				totalTimes: row.monthlyClassTotalTimes,
				status: row.monthlyClassStatus,
				monthlySubAttendance: [],
			};

			current.monthlySubAttendance.push({
				id: row.monthlySubAttendanceId,
				subjectId: row.subjectId,
				times: row.times,
				totalTimes: row.totalTimes,
				status: row.status,
				subject: {
					name: row.subjectName,
					subCode: row.subjectCode,
				},
			});

			monthlyByStudent.set(row.studentId, current);
		}

		const rows: MonthlyClassReportRow[] = [...classRecord.students]
			.sort((a, b) =>
				a.rollNo.localeCompare(b.rollNo, undefined, {
					numeric: true,
					sensitivity: "base",
				}) || a.name.localeCompare(b.name),
			)
			.map((student) => {
				const monthly = monthlyByStudent.get(student.id) ?? null;

				const subjectCells = Object.fromEntries(
					columns.map((column) => [
						column.subjectId,
						{
							subjectId: column.subjectId,
							subjectName: column.subjectName,
							subjectCode: column.subjectCode,
							times: 0,
							totalTimes: 0,
							status: false,
							monthlySubAttendanceId: null,
						},
					]),
				) as Record<string, MonthlyClassReportSubjectCell>;

				for (const subAttendance of monthly?.monthlySubAttendance ?? []) {
					subjectCells[subAttendance.subjectId] = {
						subjectId: subAttendance.subjectId,
						subjectName: subAttendance.subject.name,
						subjectCode: subAttendance.subject.subCode,
						times: subAttendance.times,
						totalTimes: subAttendance.totalTimes,
						status: subAttendance.status,
						monthlySubAttendanceId: subAttendance.id,
					};
				}

				return {
					studentId: student.id,
					studentName: student.name,
					rollNo: student.rollNo,
					monthlyClassAttendanceId: monthly?.id ?? null,
					totalTimes: monthly?.totalTimes ?? 0,
					status: monthly?.status ?? false,
					subjects: subjectCells,
				};
			});

		return {
			success: true,
			data: {
				classId: classRecord.id,
				className: classRecord.name,
				month: validated.month,
				columns,
				rows,
			},
		};
	} catch (error) {
		return handleActionErrorResponse(error);
	}
}
