import { requireAdminOrUserRoles, requireAuth } from "@/lib/guard";
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
			include: { department: true, classes: true, subjects: true },
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
	const auth = await requireAdminOrUserRoles(request, [Role.HOD, Role.ADMIN]);
	if ("response" in auth) return auth.response;

	const isAdmin = "admin" in auth;
	const authUser = "user" in auth ? auth.user : null;

	// Admin creates HOD, HOD creates TEACHER only
	const assignedRole = isAdmin ? Role.HOD : Role.TEACHER;

	try {
		const validatedData = validateBody(body, RegisterSchema);

		const {
			fullName,
			username,
			email,
			password,
			phoneNumber,
			gender,
			// role,
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

		let department;

		if (isAdmin) {
			department = await prisma.department.findFirst({
				where: { symbol: departmentName },
				select: { id: true, hodId: true },
			});
			if (!department) throw new Error("Department not found");

			if (assignedRole === Role.HOD && department.hodId) {
				throw new Error("Department already has a Head of Department");
			}
		} else {
			// if hod do not have department, he can't add teacher
			if (!authUser?.departmentId)
				throw new Error("Head of Department has no department");

			// get department by hod's department
			department = await prisma.department.findUnique({
				where: { id: authUser.departmentId },
				select: { id: true, hodId: true, symbol: true },
			});
			if (!department) throw new Error("Department not found");

			// HOD can't create user from other department
			if (departmentName && department.symbol !== departmentName) {
				throw new Error("HOD can only create users in own department");
			}
		}

		const passwordHashed = await hashPassword(password);

		// const { token: resetToken, tokenHash: resetTokenHash } =
		// 	generateResetToken();
		// const expiresAt = new Date(
		// 	Date.now() + RESET_EXPIRY_MINUTES * 60 * 1000,
		// );

		const user = await prisma.$transaction(async (tx) => {
			const created = await tx.user.create({
				data: {
					username,
					fullName,
					email,
					password: passwordHashed,
					role: assignedRole,
					gender: gender as Gender,
					phoneNumber,
					department: { connect: { id: department!.id } },
					resetPasswordToken: "",
					resetPasswordExpireAt: null,
					// resetPasswordToken: resetTokenHash,
					// resetPasswordExpireAt: expiresAt,
				},
			});

			if (assignedRole === Role.HOD) {
				await tx.department.update({
					where: { id: department!.id },
					data: { hod: { connect: { id: created.id } } },
				});
			}

			return created;
		});
		// add hod user to department's hodId
		if (assignedRole === Role.HOD) {
			await prisma.department.update({
				where: { id: department.id },
				data: { hod: { connect: { id: user.id } } },
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
