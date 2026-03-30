import {
	Gender,
	Prisma,
	Role,
	Semester,
	Year,
} from "@/generated/prisma/client";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import {
	csvEscape,
	csvResponse,
} from "@/lib/export/classDetailsCsv";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const auth = await requireAdminOrUserRoles(request, [Role.HOD, Role.ADMIN]);
	if ("response" in auth) return auth.response;

	const user = "user" in auth ? auth.user : null;
	const { searchParams } = new URL(request.url);
	const search = searchParams.get("search")?.trim() ?? "";
	const filter = searchParams.get("filter")?.trim() ?? "";

	const where: Prisma.ClassWhereInput = {};

	if (search) {
		const searchFilters: Prisma.ClassWhereInput[] = [
			{ name: { contains: search, mode: "insensitive" } },
			{ department: { name: { contains: search, mode: "insensitive" } } },
		];

		if ((Object.values(Year) as string[]).includes(search)) {
			searchFilters.push({ year: search as Year });
		}

		if ((Object.values(Semester) as string[]).includes(search)) {
			searchFilters.push({ semester: search as Semester });
		}

		where.OR = searchFilters;
	}

	if (filter) {
		where.department = {
			symbol: filter,
		};
	}

	if (user?.role === Role.HOD) {
		where.departmentId = user.departmentId;
	}

	const classes = await prisma.class.findMany({
		where,
		select: {
			id: true,
			name: true,
			year: true,
			semester: true,
			department: {
				select: {
					symbol: true,
					name: true,
				},
			},
			user: {
				select: {
					fullName: true,
				},
			},
		},
		orderBy: { name: "asc" },
	});

	const header = [
		"Class ID",
		"Class Name",
		"Year",
		"Semester",
		"Family Teacher",
		"Male",
		"Female",
		"Other",
		"Total",
		"Department Symbol",
		"Department Name",
	];

	if (classes.length === 0) {
		return csvResponse(header.join(","), "classes.csv");
	}

	const classIds = classes.map((classItem) => classItem.id);
	const [genderGrouped, totalGrouped] = await Promise.all([
		prisma.student.groupBy({
			by: ["classId", "gender"],
			where: { classId: { in: classIds } },
			_count: { _all: true },
		}),
		prisma.student.groupBy({
			by: ["classId"],
			where: { classId: { in: classIds } },
			_count: { _all: true },
		}),
	]);

	const maleByClass = new Map<string, number>();
	const femaleByClass = new Map<string, number>();
	const otherByClass = new Map<string, number>();
	const totalByClass = new Map<string, number>();

	for (const row of genderGrouped) {
		if (row.gender === Gender.MALE) maleByClass.set(row.classId, row._count._all);
		if (row.gender === Gender.FEMALE) {
			femaleByClass.set(row.classId, row._count._all);
		}
		if (row.gender === Gender.OTHER) {
			otherByClass.set(row.classId, row._count._all);
		}
	}

	for (const row of totalGrouped) {
		totalByClass.set(row.classId, row._count._all);
	}

	const rows = classes.map((classItem) => [
		csvEscape(classItem.id),
		csvEscape(classItem.name),
		csvEscape(classItem.year),
		csvEscape(classItem.semester),
		csvEscape(classItem.user?.fullName ?? "Not assigned"),
		csvEscape(maleByClass.get(classItem.id) ?? 0),
		csvEscape(femaleByClass.get(classItem.id) ?? 0),
		csvEscape(otherByClass.get(classItem.id) ?? 0),
		csvEscape(totalByClass.get(classItem.id) ?? 0),
		csvEscape(classItem.department?.symbol ?? ""),
		csvEscape(classItem.department?.name ?? ""),
	]);

	return csvResponse(
		[header.join(","), ...rows.map((row) => row.join(","))].join("\n"),
		"classes.csv",
	);
}
