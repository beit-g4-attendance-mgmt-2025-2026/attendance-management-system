import { z } from "zod";

export const CreateAcademicYearSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Academic year name is required" })
    .max(50, { message: "Academic year name must be less than 50 characters" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  isActive: z.boolean().optional().default(false),
});

export type CreateAcademicYearInput = z.infer<typeof CreateAcademicYearSchema>;

