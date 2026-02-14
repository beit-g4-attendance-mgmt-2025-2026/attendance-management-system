import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, hashToken } from "@/lib/password";
import { sendResetSuccessEmail } from "@/lib/email/mail";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { toPublicUser } from "@/lib/user";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { password } = body;
		const { searchParams } = new URL(request.url);
		const token = searchParams.get("token");

		if (!token) {
			throw new Error("Invalid or missing token");
		}

		const tokenHash = hashToken(token);
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

		await sendResetSuccessEmail(user.email);

		return handleSuccessResponse(toPublicUser(user));
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}
