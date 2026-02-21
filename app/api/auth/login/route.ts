import { setAuthCookie, signAuthToken } from "@/lib/jwt";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import {
	handleErrorResponse,
	handleSuccessResponse,
	unauthorized,
} from "@/lib/response";
import LoginSchema from "@/lib/schema/LoginSchema";
import { toPublicUser } from "@/lib/user";
import validateBody from "@/lib/validateBody";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	const body = await request.json();
	try {
		const validatedData = validateBody(body, LoginSchema);
		const { username, password } = validatedData.data;
		// check admin
		const admin = await prisma.admin.findUnique({
			where: { username },
		});

		if (admin && (await verifyPassword(password, admin.password))) {
			const token = signAuthToken(admin.id);
			const { password: _password, ...safeAdmin } = admin;
			const response = handleSuccessResponse(safeAdmin, 200);
			setAuthCookie(response, token);
			return response;
		}

		// check user
		const user = await prisma.user.findFirst({ where: { username } });

		if (user && (await verifyPassword(password, user.password))) {
			const token = signAuthToken(user.id);
			const response = handleSuccessResponse(toPublicUser(user), 200);
			setAuthCookie(response, token);
			return response;
		}

		throw new Error("Invalid credentials");
		return;
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}
