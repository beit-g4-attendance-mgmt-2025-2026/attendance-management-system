import z from "zod";

export const CreateSubjectSchema = z.object({
  name: z.string().min(2, {
    message: "Subject name must be at least 2 characters",
  }),

  subCode: z.string().min(2, {
    message: "Subject code must be at least 2 characters",
  }),

  userId: z.string().uuid("Class id must be a valid UUID"),
  classId: z.string().uuid("Class id must be a valid UUID"),
});
