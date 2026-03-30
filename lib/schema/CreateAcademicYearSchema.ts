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

// Form/input type (before Zod applies defaults)
export type CreateAcademicYearInput = z.input<typeof CreateAcademicYearSchema>;

// Parsed type (after Zod applies defaults)
export type CreateAcademicYearParsed = z.output<typeof CreateAcademicYearSchema>;
