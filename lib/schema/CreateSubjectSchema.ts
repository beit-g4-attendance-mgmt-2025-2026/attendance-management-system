import { Semester, Year } from "@/generated/prisma/enums";
import z from "zod";

export const CreateSubjectSchema = z.object({
	name: z.string().min(2, {
		message: "Subject name must be at least 2 characters",
	}),

	subCode: z.string().min(2, {
		message: "Subject code must be at least 2 characters",
	}),

	userId: z.string().uuid("Please select a valid teacher"),
	roomName: z
		.string()
		.trim()
		.max(50, "Room number must be less than 50 characters")
		.optional(),
	semester: z.enum(Semester),
	year: z.enum(Year),
});
