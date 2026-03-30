import bcrypt from "bcryptjs";
import crypto from "crypto";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
	password: string,
	hash: string,
): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

//for forget password reset token
export function generateResetToken(): { token: string; tokenHash: string } {
	const token = crypto.randomBytes(32).toString("hex");
	const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
	return { token, tokenHash };
}

export function hashToken(token: string): string {
	return crypto.createHash("sha256").update(token).digest("hex");
}
