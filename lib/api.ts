import { Gender, Role } from "@/generated/prisma/enums";
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
	},

	auth: {},
};
