import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, hashToken } from "@/lib/password";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { toPublicUser } from "@/lib/user";
import { setAuthCookie, signAuthToken } from "@/lib/jwt";
import { sendResetSuccessEmailMailtrap } from "@/lib/email/mailtrap/email";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { password } = body;
		const { searchParams } = new URL(request.url);
		const resetToken = searchParams.get("token");

		if (!resetToken) {
			throw new Error("Invalid or missing token");
		}

		const tokenHash = hashToken(resetToken);
		let user = await prisma.user.findFirst({
			where: {
				resetPasswordToken: tokenHash,
				resetPasswordExpireAt: { gt: new Date() },
			},
		});

		if (!user) throw new Error("Invalid or expired token");

		const passwordHash = await hashPassword(password);

		user = await prisma.user.update({
			where: { id: user.id },
			data: {
				password: passwordHash,
				resetPasswordToken: null as any,
				resetPasswordExpireAt: null as any,
			},
		});

		await sendResetSuccessEmailMailtrap(user.email);

		const token = signAuthToken(user.id);
		const response = handleSuccessResponse(toPublicUser(user), 200);
		setAuthCookie(response, token);

		return response;
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}
