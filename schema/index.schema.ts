import { z } from "zod";

export const LoginSchema = z.object({
	username: z.string().min(2, {
		message: "Username must be between 2 characters",
	}),
	password: z.string().min(6, {
		message: "Password must be between 6 characters",
	}),
});

export const TeacherSchema = z.object({
	full_name: z.string().min(2, {
		message: "Name must be at least 2 characters",
	}),
	username: z.string().min(4, {
		message: "Username must be at least 4 characters",
	}),
	email: z.string().email({
		message: "Invalid email address",
	}),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" }),
	phone: z.string().min(6, {
		message: "Phone number must be at least 6 characters",
	}),
	gender: z.enum(["male", "female", "other"], {
		message: "Gender must be male, female, or other",
	}),
	// .refine((val) => val == "Gender", {
	// 	message:
	// 		"Auto-detection is not allowed. Please select male, female or other.",
	// }),
	role: z.enum(["admin", "department", "teacher"], {
		message: "Role must be a valid option",
	}),
	department: z.enum(["Civil", "CEIT", "EC", "MP", "EP"], {
		message: "Department must be a valid option",
	}),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type TeacherSchemaType = z.infer<typeof TeacherSchema>;
