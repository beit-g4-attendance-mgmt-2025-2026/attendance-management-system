import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { forbidden } from "@/lib/response";
import {
	Role,
	Semester,
	type Prisma,
	Year,
} from "@/generated/prisma/client";

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

	const where: Prisma.SubjectWhereInput = {};

	if (search) {
		where.OR = [
			{ name: { contains: search, mode: "insensitive" } },
			{ subCode: { contains: search, mode: "insensitive" } },
			{
				user: {
					fullName: { contains: search, mode: "insensitive" },
				},
			},
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

	// HOD can only export their department
	if ("user" in auth && auth.user.role === Role.HOD) {
		if (!auth.user.departmentId) {
			return forbidden("HOD has no department");
		}
		where.departmentId = auth.user.departmentId;
	}

	const subjects = await prisma.subject.findMany({
		where,
		orderBy: { name: "asc" },
		select: {
			name: true,
			subCode: true,
			class: {
				select: {
					year: true,
					semester: true,
				},
			},
			user: {
				select: {
					fullName: true,
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

	const header = [
		"Subject Name",
		"Subject Code",
		"Teacher Name",
		"Year",
		"Semester",
		"Department Symbol",
		"Department Name",
	];

	const rows = subjects.map((s) => [
		csvEscape(s.name),
		csvEscape(s.subCode),
		csvEscape(s.user?.fullName ?? ""),
		csvEscape(s.class?.year ?? ""),
		csvEscape(s.class?.semester ?? ""),
		csvEscape(s.department?.symbol ?? ""),
		csvEscape(s.department?.name ?? ""),
	]);

	const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");

	return new NextResponse("\ufeff" + csv, {
		status: 200,
		headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition": `attachment; filename="subjects.csv"`,
		},
	});
}
