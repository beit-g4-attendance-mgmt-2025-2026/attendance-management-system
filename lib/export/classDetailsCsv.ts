import { Gender, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export function csvEscape(value: unknown) {
	const s = value == null ? "" : String(value);
	const escaped = s.replace(/"/g, `""`);
	return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

export function csvResponse(csv: string, filename: string) {
	return new NextResponse("\ufeff" + csv, {
		status: 200,
		headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition": `attachment; filename="${filename}"`,
		},
	});
}

export function toCsvFilename(value: string, fallback: string) {
	const normalized = value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

	return normalized || fallback;
}

export async function buildClassStudentsCsv(params: {
	classId: string;
	className: string;
	familyTeacher?: string | null;
	search?: string;
}) {
	const trimmedSearch = params.search?.trim();
	const studentsSearchSql = trimmedSearch
		? Prisma.sql`
			AND (
				s."name" ILIKE ${`%${trimmedSearch}%`}
				OR s."rollNo" ILIKE ${`%${trimmedSearch}%`}
				OR s."email" ILIKE ${`%${trimmedSearch}%`}
				OR s."phoneNumber" ILIKE ${`%${trimmedSearch}%`}
			)
		`
		: Prisma.empty;

	const students = await prisma.$queryRaw<
		Array<{
			rollNo: string;
			name: string;
			gender: Gender;
			year: string;
			semester: string;
			email: string;
			phoneNumber: string;
		}>
	>(Prisma.sql`
		SELECT
			s."rollNo",
			s."name",
			s."gender",
			s."year",
			s."semester",
			s."email",
			s."phoneNumber"
		FROM "Student" s
		WHERE s."classId" = ${params.classId}
		${studentsSearchSql}
		ORDER BY
			CASE
				WHEN s."rollNo" ~ '[0-9]+$'
					THEN (regexp_replace(s."rollNo", '^.*?([0-9]+)$', '\\1'))::int
				ELSE 2147483647
			END ASC,
			s."rollNo" ASC,
			s."name" ASC
	`);

	const header = [
		"Class Name",
		"Family Teacher",
		"Roll No",
		"Name",
		"Gender",
		"Year",
		"Semester",
		"Email",
		"Phone",
	];

	const rows = students.map((student) => [
		csvEscape(params.className),
		csvEscape(params.familyTeacher ?? ""),
		csvEscape(student.rollNo),
		csvEscape(student.name),
		csvEscape(student.gender),
		csvEscape(student.year),
		csvEscape(student.semester),
		csvEscape(student.email),
		csvEscape(student.phoneNumber),
	]);

	return [header.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

export async function buildClassSubjectsCsv(params: {
	classId: string;
	className: string;
	familyTeacher?: string | null;
	search?: string;
}) {
	const trimmedSearch = params.search?.trim();
	const searchFilter = trimmedSearch
		? {
				OR: [
					{ name: { contains: trimmedSearch, mode: "insensitive" as const } },
					{
						subCode: {
							contains: trimmedSearch,
							mode: "insensitive" as const,
						},
					},
					{
						user: {
							fullName: {
								contains: trimmedSearch,
								mode: "insensitive" as const,
							},
						},
					},
				],
			}
		: {};

	const subjects = await prisma.subject.findMany({
		where: {
			classId: params.classId,
			...searchFilter,
		},
		select: {
			subCode: true,
			name: true,
			user: {
				select: {
					fullName: true,
				},
			},
		},
		orderBy: [{ subCode: "asc" }, { name: "asc" }],
	});

	const header = [
		"Class Name",
		"Family Teacher",
		"Subject Code",
		"Subject Name",
		"Teacher",
	];

	const rows = subjects.map((subject) => [
		csvEscape(params.className),
		csvEscape(params.familyTeacher ?? ""),
		csvEscape(subject.subCode),
		csvEscape(subject.name),
		csvEscape(subject.user.fullName),
	]);

	return [header.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

export async function buildFullClassDetailsCsv(params: {
	classId: string;
	className: string;
	familyTeacher?: string | null;
}) {
	const [subjectsCsv, studentsCsv] = await Promise.all([
		buildClassSubjectsCsv({
			classId: params.classId,
			className: params.className,
			familyTeacher: params.familyTeacher,
		}),
		buildClassStudentsCsv({
			classId: params.classId,
			className: params.className,
			familyTeacher: params.familyTeacher,
		}),
	]);

	const classInfoSection = [
		"Class Information",
		"Class Name,Family Teacher",
		[csvEscape(params.className), csvEscape(params.familyTeacher ?? "")].join(","),
	];

	return [
		...classInfoSection,
		"",
		"Subjects",
		subjectsCsv,
		"",
		"Students",
		studentsCsv,
	].join("\n");
}
