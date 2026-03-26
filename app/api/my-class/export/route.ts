import { NextRequest, NextResponse } from "next/server";
import { Gender, Role } from "@/generated/prisma/client";
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

	const classRecord = await prisma.class.findFirst({
		where: {
			userId: teacher.id,
		},
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

	if (
		!classRecord ||
		(search && !classRecord.name.toLowerCase().includes(search))
	) {
		return csvResponse(header.join(","));
	}

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

	const row = [
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

	const csv = [header.join(","), row.join(",")].join("\n");
	return csvResponse(csv);
}
