import { Gender, Role, Semester, Year } from "@/generated/prisma/enums";
import fetchHandler from "./fetchHandler";

const API_URL = "http://localhost:3000/api";

export const api = {
	users: {
		// GET all teachers
		getAll: () => fetchHandler(API_URL + "/teachers"),

		// CREATE teacher
		create: (data: {
			fullName: string;
			username: string;
			email: string;
			password: string;
			phoneNumber: string;
			gender: "MALE" | "FEMALE" | "OTHER";
			role: "ADMIN" | "HOD" | "TEACHER";
			departmentName: "CIVIL" | "CEIT" | "EC" | "MP" | "EP";
			resetPasswordToken?: string | null;
			resetPasswordExpireAt?: Date | null;
		}) =>
			fetchHandler(API_URL + "/teachers", {
				method: "POST",
				body: JSON.stringify(data),
			}),

		// GET teacher by id
		getById: (id: string) => fetchHandler(API_URL + `/teachers/${id}`),

		// GET teacher by email
		getByEmail: (email: string) =>
			fetchHandler(API_URL + `/teachers/email`, {
				method: "POST",
				body: JSON.stringify({ email }),
			}),

		// UPDATE teacher
		update: (
			id: string,
			data: Partial<{
				fullName: string;
				username: string;
				email: string;
				phoneNumber: string;
				gender: Gender;
				role: Role;
				// departmentName: "Civil" | "CEIT" | "EC" | "MP" | "EP";
			}>,
		) =>
			fetchHandler(API_URL + `/teachers/${id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		// DELETE teacher
		delete: (id: string) =>
			fetchHandler(API_URL + `/teachers/${id}`, {
				method: "DELETE",
			}),

		// SEND forgot password email
		sendResetEmail: (id: string) =>
			fetchHandler(API_URL + `/teachers/${id}/forgot-password`, {
				method: "POST",
			}),
	},

	students: {
		// Get All Students
		getAll: () => fetchHandler(API_URL + `/students`),

		// CREATE student
		create: (data: {
			name: string;
			rollNo: string;
			dateOfBirth?: string | null;
			gender: "MALE" | "FEMALE" | "OTHER";
			phoneNumber: string;
			classId: string;
			email: string;
		}) =>
			fetchHandler(API_URL + "/students", {
				method: "POST",
				body: JSON.stringify(data),
			}),

		// UPDATE student
		update: (
			id: string,
			data: Partial<{
				name: string;
				rollNo: string;
				dateOfBirth?: string | null;
				gender: Gender;
				phoneNumber: string;
				classId: string;
				email: string;
			}>,
		) =>
			fetchHandler(API_URL + `/students/${id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		// DELETE student
		delete: (id: string) =>
			fetchHandler(API_URL + `/students/${id}`, {
				method: "DELETE",
			}),
	},

	classes: {
		getAll: () => fetchHandler(API_URL + "/classes"),

		getById: (id: string) => fetchHandler(API_URL + `/classes/${id}`),

		create: (data: {
			name: string;
			semester: "first_semester" | "second_semester";
			year: "FIRST" | "SECOND" | "THIRD" | "FOURTH" | "FIFTH" | "FINAL";
			academicYearId: string;
			departmentId?: string;
			userId?: string | null;
		}) =>
			fetchHandler(API_URL + "/classes", {
				method: "POST",
				body: JSON.stringify(data),
			}),

		update: (
			id: string,
			data: Partial<{
				name: string;
				semester: Semester;
				year: Year;
				academicYearId: string;
				departmentId: string;
				userId: string | null;
			}>,
		) =>
			fetchHandler(API_URL + `/classes/${id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		delete: (id: string) =>
			fetchHandler(API_URL + `/classes/${id}`, {
				method: "DELETE",
			}),
	},

	academicYears: {
		getAll: () => fetchHandler(API_URL + "/academic-years"),
		create: (data: {
			name: string;
			startDate: string;
			endDate: string;
			isActive?: boolean;
		}) =>
			fetchHandler(API_URL + "/academic-years", {
				method: "POST",
				body: JSON.stringify(data),
			}),
	},

	auth: {
		// login user/admin
		login: (data: { username: string; password: string }) =>
			fetchHandler(API_URL + "/auth/login", {
				method: "POST",
				body: JSON.stringify(data),
			}),

		// logout
		logout: () =>
			fetchHandler(API_URL + "/auth/logout", {
				method: "POST",
			}),

		// reset password using token query string
		resetPassword: (password: string, token: string) =>
			fetchHandler(
				API_URL +
					`/auth/reset-password?token=${encodeURIComponent(token)}`,
				{
					method: "POST",
					body: JSON.stringify({ password }),
				},
			),
	},

	subjects: {
		getAll: () => fetchHandler(API_URL + `/subjects`),

		create: (data: {
			name: string;
			subCode: string;
			userId: string;
			roomName?: string | null;
			year: Year;
			semester: Semester;
		}) =>
			fetchHandler(API_URL + "/subjects", {
				method: "POST",
				body: JSON.stringify(data),
			}),

		// UPDATE subject
		update: (
			id: string,
			data: Partial<{
				name: string;
				subCode: string;
				userId: string;
				roomName?: string | null;
				year: Year;
				semester: Semester;
			}>,
		) =>
			fetchHandler(API_URL + `/subjects/${id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		delete: (id: string) =>
			fetchHandler(API_URL + `/subjects/${id}`, {
				method: "DELETE",
			}),
	},

	dashboard: {
		getHodStats: () => fetchHandler(API_URL + "/dashboard/hod/stats"),
	},
};
