import type { User } from "@/generated/prisma/client";

export type PublicUser = Omit<
	User,
	"password" | "resetPasswordToken" | "resetPasswordExpireAt"
>;

export function toPublicUser(user: User): PublicUser {
	const {
		password: _password,
		resetPasswordToken: _resetPasswordToken,
		resetPasswordExpireAt: _resetPasswordExpireAt,
		...rest
	} = user;
	return rest;
}
