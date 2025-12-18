import { z } from "zod";

export const LoginSchema = z.object({
	username: z.string().min(2, {
		message: "Username must be between 2 characters",
	}),
	password: z.string().min(6, {
		message: "Password must be between 6 characters",
	}),
});
