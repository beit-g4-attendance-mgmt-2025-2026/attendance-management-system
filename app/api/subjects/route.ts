import { Role } from "@/generated/prisma/enums";
import { requireAdminOrUserRoles, requireAuth } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { CreateSubjectSchema } from "@/lib/schema/CreateSubjectSchema";
import validateBody from "@/lib/validateBody";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const auth = await requireAdminOrUserRoles(request, [
			// Role.ADMIN,
			Role.HOD,
		]);
		if ("response" in auth) return auth.response;
		// const isAdmin = "admin" in auth;
		const authUser = "user" in auth ? auth.user : null;

		if (authUser?.role !== "HOD") {
			throw new Error("You are not authorized to view subjects");
		}

		const subjects = await prisma.subject.findMany({
			where: {
				departmentId: authUser.departmentId,
			},
			include: { department: true, class: true },
		});

		return handleSuccessResponse({ subjects: subjects, status: 200 });
	} catch (error) {
		return handleErrorResponse(error);
	}
}
// export async function POST(request: NextRequest) {
// 	try {
// 		const auth = await requireAdminOrUserRoles(request, [Role.HOD]);
// 		if ("response" in auth) return auth.response;
// 		const isAdmin = "admin" in auth;
// 		const authUser = "user" in auth ? auth.user : null;

// 		if (isAdmin) {
// 			throw new Error(
// 				"Admins are not authorized to create subjects. Only HODs can.",
// 			);
// 		}
// 		if (authUser?.role !== "HOD") {
// 			throw new Error("You are not authorized to create subjects.");
// 		}

// 		const body = await request.json();
// 		const validatedData = validateBody(body, CreateSubjectSchema);
// 		const data = validatedData.data;

// 		const existingSubject = await prisma.subject.findFirst({
// 			where: {
// 				OR: [{ name: data.name }, { subCode: data.subCode }],
// 			},
// 			select: { id: true, name: true, subCode: true },
// 		});

// 		if (existingSubject) {
// 			if (existingSubject.name === data.name) {
// 				throw new Error("Subject name is already exists");
// 			}
// 			if (existingSubject.subCode === data.subCode) {
// 				throw new Error("Subject code is already exists");
// 			}
// 			throw new Error("Subject already exists");
// 		}

// 		const classRecord = await prisma.class.findFirst({
// 			where: {
// 				id: data.classId,
// 				departmentId: authUser.departmentId,
// 			},
// 			select: { id: true },
// 		});

// 		if (!classRecord) {
// 			throw new Error("Class not found for your department");
// 		}

// 		const subject = await prisma.subject.create({
// 			data: {
// 				name: data.name,
// 				subCode: data.subCode,
// 				departmentId: authUser.departmentId,
// 				userId: data.userId,
// 				classId: data.classId,
// 			},
// 			include: {
// 				department: true,
// 				class: true,
// 			},
// 		});

// 		return handleSuccessResponse({ subject }, 201);
// 	} catch (error: unknown) {
// 		return handleErrorResponse(error);
// 	}
// }

export async function POST(request: NextRequest) {
	try {
		const auth = await requireAdminOrUserRoles(request, [Role.HOD]);
		if ("response" in auth) {
			return auth.response;
		}
		const user = "user" in auth ? auth.user : null;
		const isAdmin = "admin" in auth ? auth.admin : null;

		if (isAdmin)
			throw new Error("You are not authorized to delete subjects");

		if (user?.role !== "HOD")
			throw new Error("You are not authorized to delete subjects");

		if (user.role !== "HOD")
			throw new Error("Only HOD can create subjects");

		if (!user.departmentId) throw new Error("HOD has no department");

		const body = await request.json();
		const validated = validateBody(body, CreateSubjectSchema);
		const { name, subCode, teacher_name, semester, year } = validated.data;

		const teacherCandidates = await prisma.user.findMany({
			where: {
				departmentId: user.departmentId,
				OR: [{ username: teacher_name }],
			},
			select: { id: true, username: true, fullName: true },
			take: 2,
		});

		if (teacherCandidates.length === 0) {
			throw new Error("Teacher not found in your department");
		}

		const teacher =
			teacherCandidates.find((t) => t.username === teacher_name) ??
			teacherCandidates[0];

		if (!teacher) {
			throw new Error("Teacher not found");
		}

		const classRecord = await prisma.class.findFirst({
			where: {
				departmentId: user.departmentId,
				year: year,
				semester: semester,
			},
			select: { id: true },
		});

		if (!classRecord) {
			throw new Error(
				`Class not found for ${year} ${semester} in your department`,
			);
		}

		const existingSubject = await prisma.subject.findFirst({
			where: {
				departmentId: user.departmentId,
				OR: [{ name: name }, { subCode: subCode }],
			},
			select: { id: true, name: true, subCode: true },
		});

		if (existingSubject) {
			if (existingSubject.name === name) {
				throw new Error(
					"Subject name already exists in your department",
				);
			}
			if (existingSubject.subCode === subCode) {
				throw new Error(
					"Subject code already exists in your department",
				);
			}
			throw new Error("Subject already exists");
		}

		const subject = await prisma.subject.create({
			data: {
				name: name,
				subCode: subCode,
				userId: teacher.id,
				classId: classRecord.id,
				departmentId: user.departmentId,
			},
			include: {
				user: { select: { id: true, username: true, fullName: true } },
				class: { select: { id: true, year: true, semester: true } },
				department: { select: { id: true, name: true, symbol: true } },
			},
		});
		console.log("testing ", subject);

		return handleSuccessResponse({ subject }, 201);
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}
