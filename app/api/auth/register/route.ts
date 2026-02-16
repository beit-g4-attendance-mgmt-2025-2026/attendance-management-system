import { sendWelcomeEmail } from "@/lib/email/resendEmail/mail";
import { requireAuth } from "@/lib/guard";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { toPublicUser } from "@/lib/user";
import validateBody from "@/lib/validateBody";
import { NextRequest } from "next/server";
import { Gender, Role } from "@/generated/prisma/client";
import RegisterSchema from "@/lib/schema/RegisterSchema";
import { setAuthCookie, signAuthToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
	const body = await request.json();

	try {
		const validatedData = validateBody(body, RegisterSchema);

		const {
			fullName,
			username,
			email,
			password,
			phoneNumber,
			gender,
			role,
			departmentId,
			resetPasswordToken,
			resetPasswordExpireAt,
		} = validatedData.data;

		const existingUsername = await prisma.user.findUnique({
			where: {
				username,
			},
		});
		const existingEmail = await prisma.user.findFirst({
			where: {
				email,
			},
		});

		if (existingUsername) {
			throw new Error("Username already exists");
		}
		if (existingEmail) {
			throw new Error("Email already exists");
		}

		const passwordHashed = await hashPassword(password);

		const user = await prisma.user.create({
			data: {
				username,
				fullName,
				email,
				password: passwordHashed,
				role: role as Role,
				gender: gender as Gender,
				phoneNumber,
				departmentId: departmentId || null,
				resetPasswordToken: "",
				resetPasswordExpireAt: "",
			},
		});

		await sendWelcomeEmail(user.email, user.fullName);
		const token = signAuthToken(user.id);
		const response = handleSuccessResponse(toPublicUser(user), 201);
		setAuthCookie(response, token);

		return response;
	} catch (error: unknown) {
		console.log("Error during registration:", error);
		return handleErrorResponse(error);
	}
}
