import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import validateBody from "@/lib/validateBody";
import { NextRequest } from "next/server";
import { Role } from "@/generated/prisma/client";
import CreateAdminSchema from "@/lib/schema/CreateAdminSchema";

export async function GET(request: NextRequest) {
	try {
		const admins = await prisma.admin.findMany();

		return handleSuccessResponse({
			admins,
			status: 200,
		});
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}

export async function POST(request: NextRequest) {
	const body = await request.json();

	try {
		const validatedData = validateBody(body, CreateAdminSchema);

		const { username, password, role } = validatedData.data;

		const existingUsername = await prisma.admin.findUnique({
			where: {
				username,
			},
		});

		if (existingUsername) throw new Error("Username already exists");

		const passwordHashed = await hashPassword(password);

		const admin = await prisma.admin.create({
			data: {
				username,
				password: passwordHashed,
				role: role as Role,
			},
		});

		const response = handleSuccessResponse(admin, 201);

		return response;
	} catch (error: unknown) {
		console.log("Error during creating admin: ", error);
		return handleErrorResponse(error);
	}
}
