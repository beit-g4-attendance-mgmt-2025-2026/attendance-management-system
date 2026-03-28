import { Role } from "@/generated/prisma/client";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { CreateAcademicYearSchema } from "@/lib/schema/CreateAcademicYearSchema";
import validateBody from "@/lib/validateBody";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const auth = await requireAdminOrUserRoles(request, [Role.HOD, Role.ADMIN]);
		if ("response" in auth) return auth.response;

		const academicYears = await prisma.academicYear.findMany({
			select: {
				id: true,
				name: true,
				startDate: true,
				endDate: true,
				isActive: true,
			},
			orderBy: [{ isActive: "desc" }, { startDate: "desc" }],
		});

		return handleSuccessResponse({ academicYears }, 200);
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}

export async function POST(request: NextRequest) {
	try {
		const auth = await requireAdminOrUserRoles(request, [Role.ADMIN]);
		if ("response" in auth) return auth.response;

		const body = await request.json();
		const validated = validateBody(body, CreateAcademicYearSchema);
		const data = validated.data;

		const startDate = new Date(data.startDate);
		const endDate = new Date(data.endDate);
		if (startDate > endDate) {
			throw new Error("Start date must be before end date");
		}

		const existingByName = await prisma.academicYear.findFirst({
			where: { name: data.name },
			select: { id: true },
		});
		if (existingByName) {
			throw new Error("Academic year name already exists");
		}

		const created = await prisma.$transaction(async (tx) => {
			if (data.isActive) {
				await tx.academicYear.updateMany({
					data: { isActive: false },
				});
			}

			return tx.academicYear.create({
				data: {
					name: data.name,
					startDate,
					endDate,
					isActive: data.isActive ?? false,
				},
			});
		});

		return handleSuccessResponse({ academicYear: created }, 201);
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}
