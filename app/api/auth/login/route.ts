import { setAuthCookie, signAuthToken } from "@/lib/jwt";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import LoginSchema from "@/lib/schema/LoginSchema";
import { toPublicUser } from "@/lib/user";
import validateBody from "@/lib/validateBody";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	const body = await request.json();
	try {
		const validatedData = validateBody(body, LoginSchema);
		const { username, password } = validatedData.data;
		const user = await prisma.user.findFirst({ where: { username } });
		if (!user) {
			throw new Error("Invalid credentials");
		}

		const ok = await verifyPassword(password, user.password);
		if (!ok) {
			throw new Error("Invalid credentials");
		}
		const token = signAuthToken(user.id);
		const response = handleSuccessResponse(toPublicUser(user), 200);
		setAuthCookie(response, token);

		return response;
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}
