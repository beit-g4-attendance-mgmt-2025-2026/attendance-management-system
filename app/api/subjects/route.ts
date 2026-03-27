import { Role } from "@/generated/prisma/enums";
import { requireAdminOrUserRoles } from "@/lib/guard";
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
		const auth = await requireAdminOrUserRoles(request, [
			Role.HOD,
			Role.ADMIN,
		]);
		if ("response" in auth) {
			return auth.response;
		}
		const user = "user" in auth ? auth.user : null;
		const isAdmin = "admin" in auth;

		if (!isAdmin && (!user || user.role !== "HOD")) {
			throw new Error("You are not authorized to create subjects");
		}

		const body = await request.json();
		const validated = validateBody(body, CreateSubjectSchema);
		const { name, subCode, userId, roomName, semester, year } =
			validated.data;
		const normalizedRoomName = roomName?.trim() || null;

		const teacher = await prisma.user.findFirst({
			where: {
				id: userId,
				role: Role.TEACHER,
			},
			select: { id: true, fullName: true, departmentId: true },
		});

		if (!teacher) {
			throw new Error("Teacher not found");
		}

		if (!isAdmin) {
			if (!user?.departmentId) {
				throw new Error("HOD has no department");
			}

			if (teacher.departmentId !== user.departmentId) {
				throw new Error(
					"HOD can only assign a teacher from own department",
				);
			}
		}

		const departmentId = teacher.departmentId;

		const classRecord = await prisma.class.findFirst({
			where: {
				departmentId,
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
				departmentId,
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
				departmentId,
				roomName: normalizedRoomName,
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
