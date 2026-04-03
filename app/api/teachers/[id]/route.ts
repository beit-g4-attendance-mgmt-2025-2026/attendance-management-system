import { Role } from "@/generated/prisma/enums";
import { requireAdminOrUserRoles, requireAuth } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import UserEditSchema from "@/lib/schema/TeacherEditSchema";
import { toPublicUser } from "@/lib/user";
import validateBody from "@/lib/validateBody";
import { TeacherSchema } from "@/schema/index.schema";
import { NextRequest } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	// const auth = await requireAuth(request);
	// if ("response" in auth) return auth.response;
	// const authUser = auth.user;
	// const isAdmin = authUser.role === "ADMIN";
	// const isSelf = authUser.id === params.id;
	// if (!isAdmin && !isSelf)
	// 	return handleErrorResponse("Access denied! Please contact admin.");
	const { id } = await params;

	const user = await prisma.user.findUnique({
		where: { id: id },
		include: { department: true, classes: true, subjects: true },
	});
	if (!user) return handleErrorResponse("User not found");
	return handleSuccessResponse({ user: toPublicUser(user) });
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		// const auth = await requireAuth(request, {
		// 	roles: ["ADMIN", "HOD"],
		// });

		// if ("response" in auth) return auth.response;

		const { id } = await params;

		const existingUser = await prisma.user.findUnique({ where: { id } });
		if (!existingUser) throw new Error("User not found");

		const body = await request.json();
		const validatedData = validateBody(body, TeacherSchema.partial());
		const data = validatedData.data as any;
		let nextDepartmentId: string | undefined;

		if (data.username) {
			const existing = await prisma.user.findFirst({
				where: { username: data.username, NOT: { id } },
			});
			if (existing) {
				throw new Error(`Username "${data.username}" already exists`);
			}
		}
		if (data.email) {
			const existing = await prisma.user.findFirst({
				where: { email: data.email, NOT: { id } },
			});
			if (existing) {
				throw new Error(`Email "${data.email}" already exists`);
			}
		}

		const updateData: any = { ...data };

		if (data.departmentName) {
			const department = await prisma.department.findFirst({
				where: { symbol: data.departmentName },
				select: { id: true },
			});
			if (!department) throw new Error("Department not found");

			if (
				existingUser.role === Role.HOD &&
				existingUser.departmentId !== department.id
			) {
				throw new Error(
					"Head of Department department cannot be changed from teacher edit",
				);
			}

			nextDepartmentId = department.id;
		}

		delete updateData.departmentName;

		if (nextDepartmentId) {
			updateData.departmentId = nextDepartmentId;
		}

		const user = await prisma.user.update({
			where: { id },
			data: updateData,
			include: { department: true, classes: true, subjects: true },
		});

		//! Note: Department and HOD status are not modified during teacher edit

		return handleSuccessResponse(toPublicUser(user));
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		const auth = await requireAdminOrUserRoles(request, [
			Role.HOD,
			Role.ADMIN,
		]);
		if ("response" in auth) return auth.response;

		const isAdmin = "admin" in auth;
		const authUser = "user" in auth ? auth.user : null;

		// HOD cannot delete himself
		if (authUser?.role === Role.HOD && authUser.id === id) {
			throw new Error("Head of Department cannot delete yourself");
		}

		const targetUser = await prisma.user.findUnique({ where: { id } });
		if (!targetUser) throw new Error("User not found");

		// Only admin can delete HOD users
		if (targetUser.role === Role.HOD && !isAdmin) {
			throw new Error("Only admin can delete Head of Department");
		}

		const subjectCount = await prisma.subject.count({
			where: { userId: id },
		});
		if (subjectCount > 0)
			throw new Error(
				"Cannot delete teacher with assigned subjects. Reassign or delete subjects first.",
			);

		const classCount = await prisma.class.count({
			where: { userId: id },
		});
		if (classCount > 0)
			throw new Error(
				"Cannot delete teacher assigned to a class. Reassign the class first.",
			);

		await prisma.department.updateMany({
			where: { hodId: id },
			data: { hodId: null },
		});

		await prisma.user.delete({ where: { id: id } });

		return handleSuccessResponse({ message: "User deleted successfully" });
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}
