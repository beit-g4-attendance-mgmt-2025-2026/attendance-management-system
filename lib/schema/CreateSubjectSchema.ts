import { Semester, Year } from "@/generated/prisma/enums";
import z from "zod";

export const CreateSubjectSchema = z.object({
	name: z.string().min(2, {
		message: "Subject name must be at least 2 characters",
	}),

	subCode: z.string().min(2, {
		message: "Subject code must be at least 2 characters",
	}),

	teacher_name: z.string().min(2, {
		message: "Teacher's username must be at least 2 characters",
	}),
	semester: z.enum(Semester),
	year: z.enum(Year),
});
