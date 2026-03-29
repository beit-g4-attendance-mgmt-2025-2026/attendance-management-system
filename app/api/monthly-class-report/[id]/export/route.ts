import { Month, Role } from "@/generated/prisma/client";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { buildMonthlyClassReportData } from "@/lib/report/monthlyClassReport";
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

function formatStatus(status: "good" | "risk" | "empty") {
	if (status === "good") return "Good standing";
	if (status === "risk") return "Below 75%";
	return "No data";
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

	const report = await buildMonthlyClassReportData({
		classId: classRecord.id,
		className: classRecord.name,
		month: selectedMonth,
		subjects: classRecord.subjects,
		students: classRecord.students,
	});

	const header = [
		"Roll No",
		"Name",
		...report.columns.flatMap((column) => [
			`${column.subjectCode} Present`,
			`${column.subjectCode} Total`,
			`${column.subjectCode} Percentage`,
			`${column.subjectCode} Status`,
		]),
		"Overall Present",
		"Overall Total",
		"Overall Percentage",
		"Overall Status",
	];

	const rows = report.rows.map((row) => [
		csvEscape(row.rollNo),
		csvEscape(row.studentName),
		...report.columns.flatMap((column) => {
			const cell = row.subjects[column.subjectId];
			return [
				csvEscape(cell.times),
				csvEscape(cell.totalTimes),
				csvEscape(cell.totalTimes > 0 ? cell.percentage.toFixed(1) : "0.0"),
				csvEscape(formatStatus(cell.status)),
			];
		}),
		csvEscape(row.presentTimes),
		csvEscape(row.totalTimes),
		csvEscape(row.totalTimes > 0 ? row.percentage.toFixed(1) : "0.0"),
		csvEscape(formatStatus(row.status)),
	]);

	const csv = [header.join(","), ...rows.map((row) => row.join(","))].join(
		"\n",
	);

	return csvResponse(
		csv,
		`${classRecord.name}-${selectedMonth.toLowerCase()}-monthly-report.csv`,
	);
}
