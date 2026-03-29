import { Role } from "@/generated/prisma/client";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { NextRequest } from "next/server";
import { z } from "zod";

const assignHodSchema = z.object({
	userId: z.string().uuid("Invalid user id"),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
	const auth = await requireAdminOrUserRoles(request, [Role.ADMIN]);
	if ("response" in auth) return auth.response;

	try {
		const { id } = await params;

		const department = await prisma.department.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				symbol: true,
				hodId: true,
				users: {
					where: {
						role: { in: [Role.TEACHER, Role.HOD] },
					},
					select: {
						id: true,
						fullName: true,
						username: true,
						email: true,
						role: true,
					},
					orderBy: { fullName: "asc" },
				},
			},
		});

		if (!department) throw new Error("Department not found");

		return handleSuccessResponse(
			{
				departmentId: department.id,
				departmentName: department.name,
				departmentSymbol: department.symbol,
				currentHodId: department.hodId,
				candidates: department.users,
			},
			200,
		);
	} catch (error) {
		return handleErrorResponse(error);
	}
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
	const auth = await requireAdminOrUserRoles(request, [Role.ADMIN]);
	if ("response" in auth) return auth.response;

	try {
		const { id } = await params;
		const body = await request.json();
		const { userId } = assignHodSchema.parse(body);

		const updatedDepartment = await prisma.$transaction(async (tx) => {
			const department = await tx.department.findUnique({
				where: { id },
				select: {
					id: true,
					name: true,
					symbol: true,
					hodId: true,
				},
			});
			if (!department) throw new Error("Department not found");

			const user = await tx.user.findUnique({
				where: { id: userId },
				select: {
					id: true,
					fullName: true,
					role: true,
					departmentId: true,
				},
			});
			if (!user) throw new Error("User not found");

			if (user.departmentId !== department.id) {
				throw new Error(
					"Selected user must belong to this department",
				);
			}

			if (user.role !== Role.TEACHER && user.role !== Role.HOD) {
				throw new Error("Only teacher users can be assigned as HOD");
			}

			const assignedDepartment = await tx.department.findFirst({
				where: {
					hodId: user.id,
					NOT: { id: department.id },
				},
				select: { symbol: true },
			});
			if (assignedDepartment) {
				throw new Error(
					`This user is already assigned as HOD of ${assignedDepartment.symbol}`,
				);
			}

			if (department.hodId && department.hodId !== user.id) {
				await tx.user.updateMany({
					where: {
						id: department.hodId,
						role: Role.HOD,
					},
					data: { role: Role.TEACHER },
				});
			}

			if (user.role !== Role.HOD) {
				await tx.user.update({
					where: { id: user.id },
					data: { role: Role.HOD },
				});
			}

			return tx.department.update({
				where: { id: department.id },
				data: { hodId: user.id },
				select: {
					id: true,
					name: true,
					symbol: true,
					hodId: true,
					hod: {
						select: {
							id: true,
							fullName: true,
							email: true,
							phoneNumber: true,
						},
					},
				},
			});
		});

		return handleSuccessResponse(
			{
				message: "HOD assigned successfully",
				department: updatedDepartment,
			},
			200,
		);
	} catch (error) {
		return handleErrorResponse(error);
	}
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
	const auth = await requireAdminOrUserRoles(request, [Role.ADMIN]);
	if ("response" in auth) return auth.response;

	try {
		const { id } = await params;

		const updatedDepartment = await prisma.$transaction(async (tx) => {
			const department = await tx.department.findUnique({
				where: { id },
				select: {
					id: true,
					name: true,
					symbol: true,
					hodId: true,
				},
			});
			if (!department) throw new Error("Department not found");

			if (!department.hodId) {
				return tx.department.findUnique({
					where: { id: department.id },
					select: {
						id: true,
						name: true,
						symbol: true,
						hodId: true,
						hod: {
							select: {
								id: true,
								fullName: true,
								email: true,
								phoneNumber: true,
							},
						},
					},
				});
			}

			await tx.department.update({
				where: { id: department.id },
				data: { hodId: null },
			});

			await tx.user.updateMany({
				where: {
					id: department.hodId,
					role: Role.HOD,
				},
				data: { role: Role.TEACHER },
			});

			return tx.department.findUnique({
				where: { id: department.id },
				select: {
					id: true,
					name: true,
					symbol: true,
					hodId: true,
					hod: {
						select: {
							id: true,
							fullName: true,
							email: true,
							phoneNumber: true,
						},
					},
				},
			});
		});

		return handleSuccessResponse(
			{
				message: "HOD removed successfully",
				department: updatedDepartment,
			},
			200,
		);
	} catch (error) {
		return handleErrorResponse(error);
	}
}
