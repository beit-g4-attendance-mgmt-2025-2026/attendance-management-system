import { setAuthCookie, signAuthToken } from "@/lib/jwt";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import LoginSchema from "@/lib/schema/LoginSchema";
import validateBody from "@/lib/validateBody";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	const body = await request.json();
	try {
		const validatedData = validateBody(body, LoginSchema);
		const { username, password } = validatedData.data;
		const admin = await prisma.admin.findFirst({ where: { username } });
		if (!admin) {
			throw new Error("Invalid credentials");
		}

		const matchPassword = await verifyPassword(password, admin.password);
		if (!matchPassword) {
			throw new Error("Invalid credentials");
		}
		const token = signAuthToken(admin.id);
		const response = handleSuccessResponse(admin, 200);
		setAuthCookie(response, token);

		return response;
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}
