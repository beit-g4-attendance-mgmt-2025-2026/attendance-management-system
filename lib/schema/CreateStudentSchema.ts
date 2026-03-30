import { z } from "zod";
import { Gender } from "@/generated/prisma/enums";

export const CreateStudentSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters",
	}),

	rollNo: z.string().min(2, { message: "Please enter roll number" }),

	dateOfBirth: z.string().optional(),

	phoneNumber: z.string().regex(/^09\d{7,9}$/, {
		message:
			"Invalid phone number. It should start with '09' and be followed by 7 to 9 digits.",
	}),

	gender: z.nativeEnum(Gender, {
		message: "Gender must be male, female, or other",
	}),

	email: z.string().email({
		message: "Invalid email address",
	}),
	classId: z.string().uuid("Please choose a valid class"),
});
