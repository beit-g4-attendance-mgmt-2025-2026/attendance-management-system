import { Role } from "@/generated/prisma/client";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { CreateSubjectSchema } from "@/lib/schema/CreateSubjectSchema";
import { NextRequest } from "next/server";
import z from "zod";
import validateBody from "@/lib/validateBody";

const paramsSchema = z.object({
	id: z.string().uuid(),
});

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const auth = await requireAdminOrUserRoles(request, [
			Role.HOD,
			Role.ADMIN,
		]);
		if ("response" in auth) {
			return auth.response;
		}
		const authUser = "user" in auth ? auth.user : null;

		if (authUser?.role !== "HOD") {
			throw new Error("You are not authorized to view subjects");
		}
		const { id } = await params;
		const validatedId = paramsSchema.safeParse(id);
		if (!validatedId) {
			throw new Error("Invalid id format!");
		}

		const isValid = await prisma.subject.findFirst({
			where: {
				id,
				departmentId: authUser.departmentId,
			},
		});

		if (!isValid) {
			throw new Error("Unauthorized");
		}

		const subject = await prisma.subject.findUnique({
			where: { id: id, departmentId: authUser.departmentId },
			include: { department: true, class: true },
		});
		if (!subject) {
			throw new Error("Subject not found!");
		}
		return handleSuccessResponse(subject);
	} catch (e) {
		return handleErrorResponse(e);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const auth = await requireAdminOrUserRoles(request, [Role.HOD]);
		if ("response" in auth) {
			return auth.response;
		}
		const authUser = "user" in auth ? auth.user : null;

		if (authUser?.role !== "HOD") {
			throw new Error("You are not authorized to delete subjects");
		}
		const { id } = await params;
		const validatedId = paramsSchema.safeParse(id);
		if (!validatedId) {
			throw new Error("Invalid id format!");
		}

		const isValid = await prisma.subject.findFirst({
			where: {
				id,
				departmentId: authUser.departmentId,
			},
		});

		if (!isValid) {
			throw new Error("Unauthorized");
		}

		const subject = await prisma.subject.delete({
			where: { id: id, departmentId: authUser.departmentId },
			include: { department: true, class: true },
		});

		if (!subject) {
			throw new Error("Subject not found!");
		}
		return handleSuccessResponse({
			message: "Subject deleted successfully",
		});
	} catch (e) {
		return handleErrorResponse(e);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const auth = await requireAdminOrUserRoles(request, [Role.HOD]);
		if ("response" in auth) return auth.response;

		const authUser = "user" in auth ? auth.user : null;
		const isAdmin = "admin" in auth ? auth.admin : null;

		if (!authUser || authUser.role !== "HOD" || !authUser.departmentId) {
			throw new Error("You are not authorized to update subjects");
		}
		if (isAdmin) {
			throw new Error("You are not authorized to update subjects");
		}

		const parsedParams = paramsSchema.safeParse(params);
		if (!parsedParams.success) throw new Error("Invalid id format");
		const subjectId = parsedParams.data.id;

		// authorize by department first
		const existingSubject = await prisma.subject.findFirst({
			where: {
				id: subjectId,
				departmentId: authUser.departmentId,
			},
			include: {
				class: {
					select: { year: true, semester: true },
				},
			},
		});
		if (!existingSubject) throw new Error("Unauthorized");

		const body = await request.json();
		const validated = validateBody(body, CreateSubjectSchema.partial());
		const data = validated.data as Partial<{
			name: string;
			subCode: string;
			userId: string;
			roomName: string;
			year: "FIRST" | "SECOND" | "THIRD" | "FOURTH" | "FIFTH" | "FINAL";
			semester: "first_semester" | "second_semester";
		}>;

		if (data.name) {
			const existsName = await prisma.subject.findFirst({
				where: {
					name: data.name,
					departmentId: authUser.departmentId,
					NOT: { id: subjectId },
				},
				select: { id: true },
			});
			if (existsName) throw new Error("Subject name already exists");
		}

		if (data.subCode) {
			const existsCode = await prisma.subject.findFirst({
				where: {
					subCode: data.subCode,
					departmentId: authUser.departmentId,
					NOT: { id: subjectId },
				},
				select: { id: true },
			});
			if (existsCode) throw new Error("Subject code already exists");
		}

		const updateData: any = {};

		if (data.name !== undefined) updateData.name = data.name;
		if (data.subCode !== undefined) updateData.subCode = data.subCode;
		if (data.roomName !== undefined) {
			const nextRoomName = data.roomName.trim();
			updateData.roomName = nextRoomName.length ? nextRoomName : null;
		}

		if (data.userId) {
			const teacher = await prisma.user.findFirst({
				where: {
					departmentId: authUser.departmentId,
					id: data.userId,
					role: {
						in: [Role.TEACHER, Role.HOD],
					},
				},
				select: { id: true },
			});

			if (!teacher) {
				throw new Error("Teacher/HOD not found in your department");
			}
			updateData.userId = teacher.id;
		}

		// year/semester -> resolve to classId
		const nextYear = data.year ?? existingSubject.class.year;
		const nextSemester = data.semester ?? existingSubject.class.semester;

		if (data.year !== undefined || data.semester !== undefined) {
			const classRecord = await prisma.class.findFirst({
				where: {
					departmentId: authUser.departmentId,
					year: nextYear,
					semester: nextSemester,
				},
				select: { id: true },
			});

			if (!classRecord) {
				throw new Error(
					`Class not found for ${nextYear} (${nextSemester}) in your department`,
				);
			}
			updateData.classId = classRecord.id;
		}

		const subject = await prisma.subject.update({
			where: { id: subjectId }, // only unique field here
			data: updateData,
			include: {
				department: true,
				class: true,
				user: { select: { id: true, fullName: true, username: true } },
			},
		});

		return handleSuccessResponse({
			message: "Subject updated successfully",
		});
	} catch (e) {
		return handleErrorResponse(e);
	}
}
