import { requireAuth } from "@/lib/guard";
import { generateResetToken, hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { toPublicUser } from "@/lib/user";
import validateBody from "@/lib/validateBody";
import { NextRequest } from "next/server";
import { Gender, Role } from "@/generated/prisma/client";
import RegisterSchema from "@/lib/schema/RegisterSchema";
import { setAuthCookie, signAuthToken } from "@/lib/jwt";
import { hashToken } from "../../../lib/password";
import {
	sendPasswordResetEmailMailtrap,
	sendWelcomeEmailMailtrap,
} from "@/lib/email/mailtrap/email";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
	// const auth = await requireAuth(request);
	// if ("response" in auth) return auth.response;

	try {
		const users = await prisma.user.findMany({
			include: { department: true, class: true, subjects: true },
			orderBy: [
				{
					fullName: "asc",
				},
				{
					createdAt: "desc", // if two users have the same full name, order by creation date
				},
			],
		});

		return handleSuccessResponse({
			users: users.map(toPublicUser),
			status: 200,
		});
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}

export async function POST(request: NextRequest) {
	// const RESET_EXPIRY_MINUTES = 60;
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

		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ username }, { email }],
			},
			select: { id: true, username: true, email: true },
		});

		if (existingUser) {
			if (existingUser.username === username) {
				throw new Error("Username already exists");
			}
			if (existingUser.email === email) {
				throw new Error("Email already exists");
			}
			throw new Error("User already exists");
		}

		const department = await prisma.department.findFirst({
			where: { symbol: departmentName },
		});

		if (!department) throw new Error("Department not found");

		const passwordHashed = await hashPassword(password);

		// const { token: resetToken, tokenHash: resetTokenHash } =
		// 	generateResetToken();
		// const expiresAt = new Date(
		// 	Date.now() + RESET_EXPIRY_MINUTES * 60 * 1000,
		// );

		const user = await prisma.user.create({
			data: {
				username,
				fullName,
				email,
				password: passwordHashed,
				role: role as Role,
				gender: gender as Gender,
				phoneNumber,
				department: {
					connect: { id: department.id },
				},
				resetPasswordToken: "",
				resetPasswordExpireAt: "2026-02-13T23:59:59.000Z",
				// resetPasswordToken: resetTokenHash,
				// resetPasswordExpireAt: expiresAt,
			},
		});

		// If the created user is a HOD, assign them as the department HOD
		if (role === "HOD" || role === Role.HOD) {
			await prisma.department.update({
				where: { id: department.id },
				data: {
					hod: { connect: { id: user.id } },
				},
			});
		}
		revalidatePath("/teachers");
		return handleSuccessResponse(toPublicUser(user), 201);

		// await sendWelcomeEmailMailtrap(user.email, user.fullName);
		// const token = signAuthToken(user.id);
		// const response = handleSuccessResponse(toPublicUser(user), 201);
		// setAuthCookie(response, token);

		// const baseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";
		// const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
		// await sendPasswordResetEmailMailtrap(user.email, resetUrl);

		// return response;
	} catch (error: unknown) {
		console.log("Error during registration:", error);
		return handleErrorResponse(error);
	}
}
