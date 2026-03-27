import { z } from "zod";
import { Year, Semester } from "@/generated/prisma/enums";

export const CreateClassSchema = z.object({
  name: z.string().min(2, {
    message: "Class name must be at least 2 characters",
  }),

  semester: z.nativeEnum(Semester, {
    message: "Please select a valid semester",
  }),
  year: z.nativeEnum(Year, {
    message: "Please select a valid year",
  }),

  academicYearId: z
    .string()
    .uuid("Invalid Academic Year")
    .optional()
    .nullable(),
  departmentId: z.string().uuid("Invalid department").optional(),
  userId: z.string().uuid("Invalid class teacher").optional().nullable(),
});

export type ClassFormValues = z.infer<typeof CreateClassSchema>;
