import { NextRequest, NextResponse } from "next/server";
import { Role, Semester, Year, type Prisma } from "@/generated/prisma/client";
import { requireAuth } from "@/lib/guard";
import { prisma } from "@/lib/prisma";

function csvEscape(value: unknown) {
	const s = value == null ? "" : String(value);
	const escaped = s.replace(/"/g, `""`);
	return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

function csvResponse(csv: string) {
	return new NextResponse("\ufeff" + csv, {
		status: 200,
		headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition": `attachment; filename="my-subjects.csv"`,
		},
	});
}

export async function GET(request: NextRequest) {
	const auth = await requireAuth(request, {
		roles: [Role.TEACHER, Role.HOD],
	});
	if ("response" in auth) return auth.response;

	const teacher = auth.user;
	const { searchParams } = new URL(request.url);
	const search = searchParams.get("search")?.trim() || "";
	const filter = searchParams.get("filter")?.trim() || "";
	const year = searchParams.get("year") || "";
	const semester = searchParams.get("semester") || "";

	const where: Prisma.SubjectWhereInput = {
		userId: teacher.id,
	};

	if (search) {
		where.OR = [
			{ name: { contains: search, mode: "insensitive" } },
			{ subCode: { contains: search, mode: "insensitive" } },
			{ class: { name: { contains: search, mode: "insensitive" } } },
		];
	}

	if (filter) {
		where.department = { symbol: filter };
	}

	const classFilter: Prisma.ClassWhereInput = {};
	if (year && Object.values(Year).includes(year as Year)) {
		classFilter.year = year as Year;
	}
	if (semester && Object.values(Semester).includes(semester as Semester)) {
		classFilter.semester = semester as Semester;
	}
	if (Object.keys(classFilter).length > 0) {
		where.class = { is: classFilter };
	}

	const subjects = await prisma.subject.findMany({
		where,
		orderBy: [{ name: "asc" }],
		select: {
			id: true,
			name: true,
			subCode: true,
			roomName: true,
			classId: true,
			class: {
				select: {
					name: true,
					year: true,
					semester: true,
				},
			},
			department: {
				select: {
					symbol: true,
					name: true,
				},
			},
		},
	});

	if (subjects.length === 0) {
		const header = [
			"Subject Name",
			"Subject Code",
			"Room",
			"Class Name",
			"Year",
			"Semester",
			"Total Students",
			"Department Symbol",
			"Department Name",
		];
		return csvResponse(header.join(","));
	}

	const classIds = [...new Set(subjects.map((subject) => subject.classId))];
	const groupedStudents = await prisma.student.groupBy({
		by: ["classId"],
		where: { classId: { in: classIds } },
		_count: { _all: true },
	});
	const studentCountByClass = new Map<string, number>(
		groupedStudents.map((row) => [row.classId, row._count._all]),
	);

	const header = [
		"Subject Name",
		"Subject Code",
		"Room",
		"Class Name",
		"Year",
		"Semester",
		"Total Students",
		"Department Symbol",
		"Department Name",
	];

	const rows = subjects.map((subject) => [
		csvEscape(subject.name),
		csvEscape(subject.subCode),
		csvEscape(subject.roomName ?? ""),
		csvEscape(subject.class.name),
		csvEscape(subject.class.year),
		csvEscape(subject.class.semester),
		csvEscape(studentCountByClass.get(subject.classId) ?? 0),
		csvEscape(subject.department?.symbol ?? ""),
		csvEscape(subject.department?.name ?? ""),
	]);

	const csv = [header.join(","), ...rows.map((row) => row.join(","))].join(
		"\n",
	);
	return csvResponse(csv);
}

