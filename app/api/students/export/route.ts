import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { forbidden } from "@/lib/response";
import { Role, Semester, type Prisma, Year } from "@/generated/prisma/client";

function csvEscape(value: unknown) {
	const s = value == null ? "" : String(value);
	const escaped = s.replace(/"/g, `""`);
	return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

export async function GET(request: NextRequest) {
	const auth = await requireAdminOrUserRoles(request, [Role.HOD, Role.ADMIN]);
	if ("response" in auth) return auth.response;

	const { searchParams } = new URL(request.url);
	const search = searchParams.get("search")?.trim() || "";
	const filter = searchParams.get("filter") || "";
	const year = searchParams.get("year") || "";
	const semester = searchParams.get("semester") || "";

	const where: Prisma.StudentWhereInput = {};

	if (search) {
		where.OR = [
			{ name: { contains: search, mode: "insensitive" } },
			{ rollNo: { contains: search, mode: "insensitive" } },
			{ email: { contains: search, mode: "insensitive" } },
			{ phoneNumber: { contains: search, mode: "insensitive" } },
		];
	}

	if (filter) {
		where.department = { symbol: filter };
	}

	if (year && Object.values(Year).includes(year as Year)) {
		where.year = year as Year;
	}

	if (
		semester &&
		Object.values(Semester).includes(semester as Semester)
	) {
		where.semester = semester as Semester;
	}

	// HOD can only export their department students
	if ("user" in auth && auth.user.role === Role.HOD) {
		if (!auth.user.departmentId) {
			return forbidden("HOD has no department");
		}
		where.departmentId = auth.user.departmentId;
	}

	const students = await prisma.student.findMany({
		where,
		orderBy: [{ name: "asc" }],
		select: {
			name: true,
			rollNo: true,
			email: true,
			gender: true,
			year: true,
			semester: true,
			phoneNumber: true,
			class: {
				select: { name: true },
			},
			department: {
				select: {
					symbol: true,
					name: true,
				},
			},
		},
	});

	const header = [
		"Name",
		"Roll No",
		"Email",
		"Gender",
		"Year",
		"Semester",
		"Class Name",
		"Phone",
		"Department Symbol",
		"Department Name",
	];

	const rows = students.map((s) => [
		csvEscape(s.name),
		csvEscape(s.rollNo),
		csvEscape(s.email),
		csvEscape(s.gender),
		csvEscape(s.year),
		csvEscape(s.semester),
		csvEscape(s.class?.name ?? ""),
		csvEscape(s.phoneNumber),
		csvEscape(s.department?.symbol ?? ""),
		csvEscape(s.department?.name ?? ""),
	]);

	const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");

	return new NextResponse("\ufeff" + csv, {
		status: 200,
		headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition": `attachment; filename="students.csv"`,
		},
	});
}

