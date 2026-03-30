import { days, months, times, totalTimes } from "@/constants/index.constants";
import { Gender, Role, Semester, Year } from "@/generated/prisma/enums";
import { z } from "zod";
import { ResetPasswordForm } from "../app/(auth)/components/reset-password";

export const LoginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must be less than 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    })
    .toLowerCase(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

// export const TeacherSchema = z.object({
// 	full_name: z.string().min(2, {
// 		message: "Name must be at least 2 characters",
// 	}),
// 	username: z.string().min(4, {
// 		message: "Username must be at least 4 characters",
// 	}),
// 	email: z.string().email({
// 		message: "Invalid email address",
// 	}),
// 	password: z
// 		.string()
// 		.min(6, { message: "Password must be at least 6 characters" }),
// 	phone: z.string().min(6, {
// 		message: "Phone number must be at least 6 characters",
// 	}),
// 	gender: z.enum(["male", "female", "other"], {
// 		message: "Gender must be male, female, or other",
// 	}),
// 	// .refine((val) => val == "Gender", {
// 	// 	message:
// 	// 		"Auto-detection is not allowed. Please select male, female or other.",
// 	// }),
// 	role: z.enum(["admin", "department", "teacher"], {
// 		message: "Role must be a valid option",
// 	}),
// 	department: z.enum(["Civil", "CEIT", "EC", "MP", "EP"], {
// 		message: "Department must be a valid option",
// 	}),
// });
export const TeacherSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Full name is required" })
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(50, { message: "Full name must be less than 50 characters" })
    .regex(/^[a-zA-Z.\s]+$/, {
      message: "Full name can only contain letters, spaces, and periods",
    }),

  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must be less than 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
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

  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Gender must be male, female, or other",
  }),
  role: z.enum(["ADMIN", "HOD", "TEACHER"], {
    message: "Role must be a valid option",
  }),

  phoneNumber: z
    .string()
    .min(7, { message: "Phone number is too short" })
    .max(20, { message: "Phone number is too long" })
    .regex(/^\+?[0-9\s-]+$/, { message: "Invalid phone number" }),
  departmentName: z
    .string()
    .trim()
    .min(1, { message: "Department is required" }),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(128, { message: "Password must be less than 128 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must be at least 8 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Highlight the field with the error
    message: "Passwords do not match",
  });

export const StudentSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  phone: z.string().min(6, {
    message: "Phone number must be at least 6 characters",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  gender: z.enum(["male", "female", "other"], {
    message: "Gender must be male, female, or other",
  }),
  department: z.enum(["Civil", "CEIT", "EC", "MP", "EP"], {
    message: "Please choose department",
  }),
  role_no: z.string().min(2, { message: "Please enter role number" }),

  academic_year: z.enum(
    [
      "first year",
      "second year",
      "third year",
      "fourth year",
      "fifth year",
      "sixth year",
    ],
    {
      message: "Please choose academic year",
    },
  ),
  semester: z.enum(["first semester", "second semester"], {
    message: "Please choose semester",
  }),
});

export const DepartmentSchema = z.object({
  name: z.string().min(2, {
    message: "Please enter department name",
  }),
  symbol: z.string().min(1, {
    message: "Department symbol must be at least 1 character",
  }),
  logo: z
    .instanceof(File)
    .or(z.null())
    .refine((file) => file !== null, {
      message: "Logo is required",
    }),
});

export const SubjectSchema = z.object({
  name: z.string().min(2, {
    message: "Please enter subject name",
  }),
  subCode: z.string().min(2, {
    message: "Please enter subject code",
  }),
  userId: z.string().uuid({
    message: "Please choose teacher",
  }),
  roomName: z
    .string()
    .trim()
    .max(50, {
      message: "Room number must be less than 50 characters",
    })
    .optional(),
  semester: z.enum(Semester, {
    message: "Please choose semester",
  }),
  year: z.enum(Year, {
    message: "Please choose year",
  }),
});

export const ClassSchema = z.object({
  name: z.string().min(2, {
    message: "Please enter class name",
  }),
  teacher_name: z.string().min(2, {
    message: "Please enter username of teacher",
  }),
  semester: z.enum(["first semester", "second semester"], {
    message: "Please choose semester",
  }),
  academic_year: z.enum(
    [
      "first year",
      "second year",
      "third year",
      "fourth year",
      "fifth year",
      "sixth year",
    ],
    {
      message: "Please choose year",
    },
  ),
});

const dayValues = days.map((d) => d.value) as [string, ...string[]];
const monthValues = months.map((m) => m.value) as [string, ...string[]];
const timeValues = times.map((m) => m.value) as [string, ...string[]];
const totalTimeValues = totalTimes.map((m) => m.value) as [string, ...string[]];
export const TakeAttendanceSchema = z.object({
  SubjectId: z.string(),
  Day: z.enum(dayValues, {
    message: "Please choose a day",
  }),
  Month: z.enum(monthValues, {
    message: "Please choose a month",
  }),

  TotalTimes: z.enum(totalTimeValues, {
    message: "Please choose total times",
  }),
  Times: z.record(
    z.string(),
    z.enum(timeValues, {
      message: "Please choose times for this student",
    }),
  ),
});

export type TakeAttendanceSchemaType = z.infer<typeof TakeAttendanceSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type TeacherSchemaType = z.infer<typeof TeacherSchema>;
export type StudentSchemaType = z.infer<typeof StudentSchema>;
export type DepartmentSchemaType = z.infer<typeof DepartmentSchema>;
export type ClassSchemaType = z.infer<typeof ClassSchema>;
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
