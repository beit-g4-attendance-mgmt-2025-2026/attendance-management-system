import { z } from "zod";
import { Role, Gender } from "../../generated/prisma/enums";

const RegisterSchema = z.object({
	fullName: z
		.string()
		.min(1, { message: "Full name is required" })
		.min(2, { message: "Full name must be at least 2 characters" })
		.max(50, { message: "Full name must be less than 50 characters" })
		.regex(/^[a-zA-Z\s]+$/, {
			message: "Full name can only contain letters and spaces",
		}),

	username: z
		.string()
		.min(3, { message: "Username must be at least 3 characters" })
		.max(30, { message: "Username must be less than 30 characters" })
		.regex(/^[a-zA-Z0-9_]+$/, {
			message:
				"Username can only contain letters, numbers, and underscores",
		})
		.toLowerCase(),

	email: z
		.string()
		.min(1, { message: "Email is required" })
		.email({ message: "Please provide a valid email address" })
		.toLowerCase(),

	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.max(128, { message: "Password must be less than 128 characters" })
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
			message:
				"Password must contain at least one lowercase letter, one uppercase letter, and one number",
		}),

	role: z.nativeEnum(Role),
	gender: z.nativeEnum(Gender),

	phoneNumber: z
		.string()
		.min(7, { message: "Phone number is too short" })
		.max(20, { message: "Phone number is too long" })
		.regex(/^\+?[0-9\s-]+$/, { message: "Invalid phone number" }),
	departmentName: z
		.string()
		.trim()
		.min(1, { message: "Department is required" }),
	resetPasswordToken: z.string().nullable().optional(),
	resetPasswordExpireAt: z.coerce.date().nullable().optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export default RegisterSchema;
