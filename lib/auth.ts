import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { User } from "@/app/generated/prisma/client";

export type AuthTokenPayload = {
	userId: string;
};

function getJwtSecret(): string {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET is not set");
	}
	return secret;
}

//sign a JWT token with userId
export function signAuthToken(userId: string): string {
	return jwt.sign({ userId } satisfies AuthTokenPayload, getJwtSecret(), {
		expiresIn: "7d",
	});
}

//set auth cookie in response
export function setAuthCookie(response: NextResponse, token: string) {
	response.cookies.set({
		name: "token",
		value: token,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60,
	});
}

export function clearAuthCookie(response: NextResponse) {
	response.cookies.set({
		name: "token",
		value: "",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 0,
	});
}

//check token and return userId
export function getUserIdFromRequest(request: NextRequest): string | null {
	const token = request.cookies.get("token")?.value;
	if (!token) return null;

	try {
		const decoded = jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
		return decoded.userId;
	} catch {
		return null;
	}
}

//fetch user from database based on userId from token
export async function getAuthUser(request: NextRequest): Promise<User | null> {
	const userId = getUserIdFromRequest(request);
	if (!userId) return null;

	return prisma.user.findUnique({ where: { id: userId } });
}
