import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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

export function signAuthToken(userId: string): string {
	return jwt.sign({ userId } satisfies AuthTokenPayload, getJwtSecret(), {
		expiresIn: "7d",
	});
}

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

export async function getUserIdFromCookies(): Promise<string | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	if (!token) return null;

	try {
		const decoded = jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
		return decoded.userId;
	} catch {
		return null;
	}
}
