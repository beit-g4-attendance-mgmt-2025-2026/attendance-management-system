import { Month, Role } from "@/generated/prisma/client";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function csvEscape(value: unknown) {
	const s = value == null ? "" : String(value);
	const escaped = s.replace(/"/g, `""`);
	return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

function csvResponse(csv: string, filename: string) {
	return new NextResponse("\ufeff" + csv, {
		status: 200,
		headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition": `attachment; filename="${filename}"`,
		},
	});
}

function getSelectedMonth(rawMonth?: string | null) {
	if (rawMonth && Object.values(Month).includes(rawMonth as Month)) {
		return rawMonth as Month;
	}

	return Object.values(Month)[new Date().getMonth()];
}

function getPercentage(times: number, totalTimes: number) {
	if (totalTimes <= 0) return 0;
	return (times / totalTimes) * 100;
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const auth = await requireAdminOrUserRoles(request, [Role.TEACHER, Role.HOD]);
	if ("response" in auth) return auth.response;

	const { id } = await params;
	const selectedMonth = getSelectedMonth(
		new URL(request.url).searchParams.get("month"),
	);

	const user = "user" in auth ? auth.user : null;

	const classRecord = await prisma.class.findFirst({
		where: {
			id,
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
		return new NextResponse("Class not found", { status: 404 });
	}

	type MonthlyJoinedRow = {
		monthlyClassAttendanceId: string;
		monthlyClassStatus: boolean;
		studentId: string;
		monthlySubAttendanceId: string;
		subjectId: string;
		times: number;
		totalTimes: number;
		status: boolean;
	};

	const monthlyJoinedRows = await prisma.$queryRawUnsafe<MonthlyJoinedRow[]>(
		`
		SELECT
			mca."id" AS "monthlyClassAttendanceId",
			mca."status" AS "monthlyClassStatus",
			msa."studentId" AS "studentId",
			msa."id" AS "monthlySubAttendanceId",
			msa."subjectId" AS "subjectId",
			msa."times" AS "times",
			msa."totalTimes" AS "totalTimes",
			msa."status" AS "status"
		FROM "MonthlySubAttendance" msa
		INNER JOIN "MonthlyClassAttendance" mca
			ON mca."id" = msa."monthlyClassAttendanceId"
		WHERE mca."classId" = $1::uuid
		`,
		classRecord.id,
	);

	const monthlyByStudent = new Map<
		string,
		{
			status: boolean;
			monthlySubAttendance: Array<{
				subjectId: string;
				times: number;
				totalTimes: number;
			}>;
		}
	>();

	for (const row of monthlyJoinedRows) {
		const current = monthlyByStudent.get(row.studentId) ?? {
			status: row.monthlyClassStatus,
			monthlySubAttendance: [],
		};

		current.monthlySubAttendance.push({
			subjectId: row.subjectId,
			times: row.times,
			totalTimes: row.totalTimes,
		});

		monthlyByStudent.set(row.studentId, current);
	}

	const header = [
		"Roll No",
		"Name",
		...classRecord.subjects.map(
			(subject) => `${subject.subCode} - ${subject.name} (%)`,
		),
		"Overall (%)",
		"Overall Status",
	];

	const rows = [...classRecord.students]
		.sort(
			(a, b) =>
				a.rollNo.localeCompare(b.rollNo, undefined, {
					numeric: true,
					sensitivity: "base",
				}) || a.name.localeCompare(b.name),
		)
		.map((student) => {
			const monthly = monthlyByStudent.get(student.id);
			const monthlySubBySubject = new Map<string, {
				subjectId: string;
				times: number;
				totalTimes: number;
			}>(
				(monthly?.monthlySubAttendance ?? []).map((row) => [
					row.subjectId,
					row,
				]),
			);

			const subjectPercentages = classRecord.subjects.map((subject) => {
				const cell = monthlySubBySubject.get(subject.id);
				return csvEscape(
					getPercentage(cell?.times ?? 0, cell?.totalTimes ?? 0).toFixed(1),
				);
			});

			const overallTotals = Array.from(monthlySubBySubject.values()).reduce(
				(acc, cell) => ({
					times: acc.times + cell.times,
					totalTimes: acc.totalTimes + cell.totalTimes,
				}),
				{ times: 0, totalTimes: 0 },
			);

			return [
				csvEscape(student.rollNo),
				csvEscape(student.name),
				...subjectPercentages,
				csvEscape(
					getPercentage(overallTotals.times, overallTotals.totalTimes).toFixed(1),
				),
				csvEscape(monthly?.status ? "Good standing" : "Below 75%"),
			];
		});

	const csv = [header.join(","), ...rows.map((row) => row.join(","))].join(
		"\n",
	);

	return csvResponse(
		csv,
		`${classRecord.name}-${selectedMonth.toLowerCase()}-monthly-report.csv`,
	);
}
