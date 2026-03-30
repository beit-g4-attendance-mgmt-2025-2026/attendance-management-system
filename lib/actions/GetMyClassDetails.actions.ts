"use server";

import { Gender, Prisma, Role } from "@/generated/prisma/client";
import { getUserIdFromCookies } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { handleActionErrorResponse } from "@/lib/response";
import type {
	MyClassItem,
	MyClassStudentItem,
	MyClassSubjectItem,
} from "@/lib/actions/GetMyClass.actions";

type Params = {
	classId: string;
	studentsPage?: number;
	studentsPageSize?: number;
	subjectsPage?: number;
	subjectsPageSize?: number;
	studentsSearch?: string;
	subjectsSearch?: string;
};

export async function GetMyClassDetails(params: Params): Promise<{
	success: boolean;
	data?: {
		myClass: MyClassItem;
		classMeta: {
			id: string;
			name: string;
			userId: string | null;
		};
		students: MyClassStudentItem[];
		studentsTotal: number;
		studentsIsNext: boolean;
		subjects: MyClassSubjectItem[];
		subjectsTotal: number;
		subjectsIsNext: boolean;
	};
	message?: string;
	details?: object | null;
}> {
	try {
		const {
			classId,
			studentsPage = 1,
			studentsPageSize = 10,
			subjectsPage = 1,
			subjectsPageSize = 10,
			studentsSearch,
			subjectsSearch,
		} = params;

		const authId = await getUserIdFromCookies();
		if (!authId) return { success: false, message: "Unauthorized" };

		const admin = await prisma.admin.findUnique({ where: { id: authId } });
		if (admin) return { success: false, message: "Forbidden" };

		const user = await prisma.user.findUnique({
			where: { id: authId },
			select: {
				id: true,
				fullName: true,
				role: true,
			},
		});
		if (!user) return { success: false, message: "Unauthorized" };
		if (user.role !== Role.TEACHER && user.role !== Role.HOD) {
			return { success: false, message: "Forbidden" };
		}

		const classRecord = await prisma.class.findFirst({
			where: {
				id: classId,
				userId: user.id,
			},
			select: {
				id: true,
				name: true,
				userId: true,
			},
		});

		if (!classRecord) {
			return { success: false, message: "Class not found" };
		}

		const [male, female, total] = await Promise.all([
			prisma.student.count({
				where: { classId, gender: Gender.MALE },
			}),
			prisma.student.count({
				where: { classId, gender: Gender.FEMALE },
			}),
			prisma.student.count({
				where: { classId },
			}),
		]);

		const myClass: MyClassItem = {
			id: classRecord.id,
			name: classRecord.name,
			familyTeacher: user.fullName,
			male,
			female,
			total,
		};

		const studentsWhere: Prisma.StudentWhereInput = {
			classId,
		};
		if (studentsSearch?.trim()) {
			const search = studentsSearch.trim();
			studentsWhere.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ rollNo: { contains: search, mode: "insensitive" } },
				{ email: { contains: search, mode: "insensitive" } },
				{ phoneNumber: { contains: search, mode: "insensitive" } },
			];
		}

		const studentsSkip =
			(Number(studentsPage) - 1) * Number(studentsPageSize);
		const studentsTake = Number(studentsPageSize);
		const trimmedStudentsSearch = studentsSearch?.trim();
		const studentsSearchSql = trimmedStudentsSearch
			? Prisma.sql`
				AND (
					s."name" ILIKE ${`%${trimmedStudentsSearch}%`}
					OR s."rollNo" ILIKE ${`%${trimmedStudentsSearch}%`}
					OR s."email" ILIKE ${`%${trimmedStudentsSearch}%`}
					OR s."phoneNumber" ILIKE ${`%${trimmedStudentsSearch}%`}
				)
			`
			: Prisma.empty;

		const [studentsTotal, studentsRows] = await Promise.all([
			prisma.student.count({ where: studentsWhere }),
			prisma.$queryRaw<
				Array<{
					id: string;
					name: string;
					rollNo: string;
					gender: Gender;
					email: string;
					phoneNumber: string;
					year: string;
					semester: string;
				}>
			>(Prisma.sql`
				SELECT
					s."id",
					s."name",
					s."rollNo",
					s."gender",
					s."email",
					s."phoneNumber",
					s."year",
					s."semester"
				FROM "Student" s
				WHERE s."classId" = ${classId}
				${studentsSearchSql}
				ORDER BY
					CASE
						WHEN s."rollNo" ~ '[0-9]+$'
							THEN (regexp_replace(s."rollNo", '^.*?([0-9]+)$', '\\1'))::int
						ELSE 2147483647
					END ASC,
					s."rollNo" ASC,
					s."name" ASC
				LIMIT ${studentsTake}
				OFFSET ${studentsSkip}
			`),
		]);

		const students: MyClassStudentItem[] = studentsRows.map((s) => ({
			id: s.id,
			name: s.name,
			rollNo: s.rollNo,
			gender: s.gender,
			email: s.email,
			phoneNumber: s.phoneNumber,
			year: s.year,
			semester: s.semester,
		}));

		const subjectsWhere: Prisma.SubjectWhereInput = {
			classId,
		};
		if (subjectsSearch?.trim()) {
			const search = subjectsSearch.trim();
			subjectsWhere.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ subCode: { contains: search, mode: "insensitive" } },
				{
					user: {
						fullName: { contains: search, mode: "insensitive" },
					},
				},
			];
		}

		const subjectsSkip = (Number(subjectsPage) - 1) * Number(subjectsPageSize);
		const subjectsTake = Number(subjectsPageSize);

		const [subjectsTotal, subjectsRows] = await Promise.all([
			prisma.subject.count({ where: subjectsWhere }),
			prisma.subject.findMany({
				where: subjectsWhere,
				select: {
					id: true,
					name: true,
					subCode: true,
					user: {
						select: {
							id: true,
							fullName: true,
						},
					},
				},
				orderBy: [{ subCode: "asc" }, { name: "asc" }],
				skip: subjectsSkip,
				take: subjectsTake,
			}),
		]);

		const subjects: MyClassSubjectItem[] = subjectsRows.map((s) => ({
			id: s.id,
			name: s.name,
			subCode: s.subCode,
			classId: classRecord.id,
			className: classRecord.name,
			teacherId: s.user.id,
			teacherName: s.user.fullName,
		}));

		return {
			success: true,
			data: {
				myClass,
				classMeta: {
					id: classRecord.id,
					name: classRecord.name,
					userId: classRecord.userId,
				},
				students,
				studentsTotal,
				studentsIsNext: studentsTotal > studentsSkip + students.length,
				subjects,
				subjectsTotal,
				subjectsIsNext: subjectsTotal > subjectsSkip + subjects.length,
			},
		};
	} catch (error) {
		return handleActionErrorResponse(error);
	}
}
