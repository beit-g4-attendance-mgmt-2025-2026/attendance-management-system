import { z } from "zod";
import { Gender, Year, Semester } from "@/generated/prisma/enums"; // import your Prisma enums

export const CreateStudentSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),

  rollNo: z.string().min(2, { message: "Please enter roll number" }),

  dateOfBirth: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.date().optional(),
  ),

  phoneNumber: z.string().min(6, {
    message: "Phone number must be at least 6 characters",
  }),

  gender: z.nativeEnum(Gender, {
    message: "Gender must be male, female, or other",
  }),

  email: z.string().email({
    message: "Invalid email address",
  }),

  year: z.nativeEnum(Year, {
    message: "Please choose a valid year",
  }),

  semester: z.nativeEnum(Semester, {
    message: "Please choose semester",
  }),
  classId: z.string().uuid("Class id must be a valid UUID"),
});
