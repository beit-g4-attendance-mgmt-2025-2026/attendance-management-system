import { Month, Role } from "@/generated/prisma/client";
import { requireAuth } from "@/lib/guard";
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

function toCsvFilename(value: string, fallback: string) {
	const normalized = value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

	return normalized || fallback;
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const auth = await requireAuth(request, {
		roles: [Role.TEACHER, Role.HOD],
	});
	if ("response" in auth) return auth.response;

	const { id } = await params;
	const selectedMonth = getSelectedMonth(
		new URL(request.url).searchParams.get("month"),
	);

	const subject = await prisma.subject.findFirst({
		where: {
			id,
			userId: auth.user.id,
		},
		select: {
			id: true,
			name: true,
			subCode: true,
			class: {
				select: {
					name: true,
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
		return new NextResponse("Subject not found", { status: 404 });
	}

	const attendance = await prisma.dailyAttendance.findMany({
		where: {
			subjectId: subject.id,
			month: selectedMonth,
		},
		select: {
			day: true,
			studentId: true,
			times: true,
			totalTimes: true,
		},
		orderBy: [{ day: "asc" }],
	});

	const totalsByStudent = new Map<
		string,
		{ presentTimes: number; totalTimes: number }
	>();
	const totalTimesByDay = new Map<number, number>();

	for (const item of attendance) {
		if (!totalTimesByDay.has(item.day)) {
			totalTimesByDay.set(item.day, item.totalTimes);
		}

		const current = totalsByStudent.get(item.studentId) ?? {
			presentTimes: 0,
			totalTimes: 0,
		};
		current.presentTimes += item.times;
		current.totalTimes += item.totalTimes;
		totalsByStudent.set(item.studentId, current);
	}

	const monthlyTotalTimes = Array.from(totalTimesByDay.values()).reduce(
		(sum, totalTimes) => sum + totalTimes,
		0,
	);

	const header = [
		"Subject Name",
		"Subject Code",
		"Class Name",
		"Month",
		"Monthly Total Times",
		"Roll No",
		"Student Name",
		"Present Times",
		"Student Total Times",
		"Percentage",
	];

	const rows = subject.class.students.map((student) => {
		const totals = totalsByStudent.get(student.id) ?? {
			presentTimes: 0,
			totalTimes: 0,
		};
		const percentage =
			totals.totalTimes > 0
				? ((totals.presentTimes / totals.totalTimes) * 100).toFixed(1)
				: "0.0";

		return [
			csvEscape(subject.name),
			csvEscape(subject.subCode),
			csvEscape(subject.class.name),
			csvEscape(selectedMonth),
			csvEscape(monthlyTotalTimes),
			csvEscape(student.rollNo),
			csvEscape(student.name),
			csvEscape(totals.presentTimes),
			csvEscape(totals.totalTimes),
			csvEscape(percentage),
		];
	});

	const csv = [header.join(","), ...rows.map((row) => row.join(","))].join(
		"\n",
	);

	return csvResponse(
		csv,
		`${toCsvFilename(subject.name, "subject")}-${selectedMonth.toLowerCase()}-monthly-report.csv`,
	);
}
