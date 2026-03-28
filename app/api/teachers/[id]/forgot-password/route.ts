import { Role } from "@/generated/prisma/client";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { sendPasswordResetEmailMailtrap } from "@/lib/email/mailtrap/email";
import { generateResetToken } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import {
	forbidden,
	handleErrorResponse,
	handleSuccessResponse,
} from "@/lib/response";
import { NextRequest } from "next/server";

const RESET_EXPIRY_MINUTES = 60;

export async function POST(
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

		const targetTeacher = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				role: true,
				email: true,
				departmentId: true,
			},
		});

		if (!targetTeacher) throw new Error("Teacher not found");
		if (targetTeacher.role !== Role.TEACHER) {
			return forbidden("Reset email can only be sent to teacher accounts");
		}

		if ("user" in auth && auth.user.role === Role.HOD) {
			if (!auth.user.departmentId) {
				return forbidden("HOD has no department");
			}
			if (auth.user.departmentId !== targetTeacher.departmentId) {
				return forbidden(
					"You can only send reset email to teachers in your department",
				);
			}
		}

		const { token, tokenHash } = generateResetToken();
		const expiresAt = new Date(
			Date.now() + RESET_EXPIRY_MINUTES * 60 * 1000,
		);

		await prisma.user.update({
			where: { id: targetTeacher.id },
			data: {
				resetPasswordToken: tokenHash,
				resetPasswordExpireAt: expiresAt,
			},
		});

		const rawBaseUrl =
			process.env.APP_BASE_URL ??
			process.env.NEXT_PUBLIC_BASE_URL ??
			new URL(request.url).origin;
		const baseUrl = rawBaseUrl.replace(/\/$/, "");
		const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(
			token,
		)}`;

		await sendPasswordResetEmailMailtrap(targetTeacher.email, resetUrl);

		return handleSuccessResponse(
			{ message: "Password reset email sent successfully" },
			200,
		);
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}
