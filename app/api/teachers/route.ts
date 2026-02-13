import { sendWelcomeEmail } from "@/lib/email/mail";
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

export async function GET(request: NextRequest) {
	const auth = await requireAuth(request);
	if ("response" in auth) return auth.response;

	const users = await prisma.user.findMany({
		include: { department: true, class: true, subjects: true },
	});

	return handleSuccessResponse({
		users: users.map(toPublicUser),
		status: 200,
	});
}

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
			departmentName,
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
		const department = await prisma.department.findFirst({
			where: { symbol: departmentName },
		});

		if (existingUsername) throw new Error("Username already exists");

		if (existingEmail) throw new Error("Email already exists");

		if (!department) throw new Error("Department not found");

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
				departmentId: {
					connect: { id: department.id },
				},
				resetPasswordToken: resetPasswordToken ?? null,
				resetPasswordExpireAt: resetPasswordExpireAt ?? null,
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
