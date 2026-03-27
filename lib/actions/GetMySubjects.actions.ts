"use server";

import { Role, Semester, Year, type Prisma } from "@/generated/prisma/client";
import { getUserIdFromCookies } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { handleActionErrorResponse } from "@/lib/response";
import PaginatedSearchParamsSchema from "@/lib/schema/PaginatedSearchParamsSchema";
import validateBody from "@/lib/validateBody";

export type MySubjectItem = {
	id: string;
	name: string;
	code: string;
	roomName: string | null;
	total: number;
	classId: string;
	className: string;
	// year: Year;
	// semester: Semester;
};

export async function GetMySubjects(params: {
	page?: number;
	pageSize?: number;
	search?: string;
	filter?: string;
	sort?: string;
}): Promise<{
	success: boolean;
	data?: {
		mySubjects: MySubjectItem[];
		total: number;
		isNext: boolean;
	};
	message?: string;
	details?: object | null;
}> {
	try {
		const authId = await getUserIdFromCookies();
		if (!authId) return { success: false, message: "Unauthorized" };

		const admin = await prisma.admin.findUnique({ where: { id: authId } });
		if (admin) return { success: false, message: "Forbidden" };

		const user = await prisma.user.findUnique({
			where: { id: authId },
			select: { id: true, role: true },
		});
		if (!user) return { success: false, message: "Unauthorized" };
		if (user.role !== Role.TEACHER && user.role !== Role.HOD) {
			return { success: false, message: "Forbidden" };
		}

		const validated = validateBody(params, PaginatedSearchParamsSchema);
		const {
			page = 1,
			pageSize = 10,
			search,
			filter,
			sort,
		} = validated.data;

		const skip = (Number(page) - 1) * Number(pageSize);
		const take = Number(pageSize);

		const andFilters: Prisma.SubjectWhereInput[] = [{ userId: user.id }];

		if (search?.trim()) {
			const searchValue = search.trim();
			andFilters.push({
				OR: [
					{ name: { contains: searchValue, mode: "insensitive" } },
					{ subCode: { contains: searchValue, mode: "insensitive" } },
					{
						class: {
							name: {
								contains: searchValue,
								mode: "insensitive",
							},
						},
					},
				],
			});
		}

		if (filter?.trim()) {
			const filterValue = filter.trim();

			if ((Object.values(Year) as string[]).includes(filterValue)) {
				andFilters.push({
					class: {
						year: filterValue as Year,
					},
				});
			} else if (
				(Object.values(Semester) as string[]).includes(filterValue)
			) {
				andFilters.push({
					class: {
						semester: filterValue as Semester,
					},
				});
			} else {
				andFilters.push({
					OR: [
						{
							department: {
								symbol: filterValue,
							},
						},
						{
							class: {
								name: {
									contains: filterValue,
									mode: "insensitive",
								},
							},
						},
					],
				});
			}
		}

		const where: Prisma.SubjectWhereInput =
			andFilters.length === 1 ? andFilters[0] : { AND: andFilters };

		let orderBy: Prisma.SubjectOrderByWithRelationInput[] = [
			{ name: "asc" },
		];
		switch (sort) {
			case "name_desc":
				orderBy = [{ name: "desc" }];
				break;
			case "code_asc":
				orderBy = [{ subCode: "asc" }];
				break;
			case "code_desc":
				orderBy = [{ subCode: "desc" }];
				break;
			default:
				orderBy = [{ name: "asc" }];
				break;
		}

		const [total, subjects] = await Promise.all([
			prisma.subject.count({ where }),
			prisma.subject.findMany({
				where,
				include: {
					class: {
						select: {
							name: true,
							year: true,
							semester: true,
						},
					},
				},
				skip,
				take,
				orderBy,
			}),
		]);

		const classIds = [
			...new Set(subjects.map((subject) => subject.classId)),
		];
		const groupedStudents =
			classIds.length > 0
				? await prisma.student.groupBy({
						by: ["classId"],
						where: { classId: { in: classIds } },
						_count: { _all: true },
					})
				: [];

		const studentCountByClass = new Map<string, number>(
			groupedStudents.map((row) => [row.classId, row._count._all]),
		);

		const mySubjects: MySubjectItem[] = subjects.map((subject) => ({
			id: subject.id,
			name: subject.name,
			code: subject.subCode,
			roomName: subject.roomName,
			total: studentCountByClass.get(subject.classId) ?? 0,
			classId: subject.classId,
			className: subject.class.name,
			// year: subject.class.year,
			// semester: subject.class.semester,
		}));

		return {
			success: true,
			data: {
				mySubjects,
				total,
				isNext: total > skip + mySubjects.length,
			},
		};
	} catch (error) {
		return handleActionErrorResponse(error);
	}
}
