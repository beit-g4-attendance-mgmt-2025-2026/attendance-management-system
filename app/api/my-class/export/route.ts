import { NextRequest, NextResponse } from "next/server";
import { Gender, Role, type Prisma } from "@/generated/prisma/client";
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
			"Content-Disposition": `attachment; filename="my-class.csv"`,
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
	const search = searchParams.get("search")?.trim().toLowerCase() || "";

	const where: Prisma.ClassWhereInput = {
		userId: teacher.id,
	};
	if (search) {
		where.name = { contains: search, mode: "insensitive" };
	}

	const classRecords = await prisma.class.findMany({
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
		},
		orderBy: {
			name: "asc",
		},
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

	if (classRecords.length === 0) {
		return csvResponse(header.join(","));
	}

	const rows = await Promise.all(
		classRecords.map(async (classRecord) => {
			const [male, female, other, total] = await Promise.all([
				prisma.student.count({
					where: { classId: classRecord.id, gender: Gender.MALE },
				}),
				prisma.student.count({
					where: { classId: classRecord.id, gender: Gender.FEMALE },
				}),
				prisma.student.count({
					where: { classId: classRecord.id, gender: Gender.OTHER },
				}),
				prisma.student.count({
					where: { classId: classRecord.id },
				}),
			]);

			return [
				csvEscape(classRecord.id),
				csvEscape(classRecord.name),
				csvEscape(classRecord.year),
				csvEscape(classRecord.semester),
				csvEscape(teacher.fullName),
				csvEscape(male),
				csvEscape(female),
				csvEscape(other),
				csvEscape(total),
				csvEscape(classRecord.department?.symbol ?? ""),
				csvEscape(classRecord.department?.name ?? ""),
			];
		}),
	);

	const csv = [header.join(","), ...rows.map((row) => row.join(","))].join(
		"\n",
	);
	return csvResponse(csv);
}
