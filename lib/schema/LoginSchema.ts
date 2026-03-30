import { z } from "zod";

const LoginSchema = z.object({
	username: z
		.string()
		.min(3, { message: "Username must be at least 3 characters" })
		.max(30, { message: "Username must be less than 30 characters" })
		.regex(/^[a-zA-Z0-9_]+$/, {
			message:
				"Username can only contain letters, numbers, and underscores",
		})
		.toLowerCase(),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export default LoginSchema;
