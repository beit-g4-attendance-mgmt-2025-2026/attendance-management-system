import type { Role } from "@/generated/prisma/enums";

export type UiRole = "admin" | "department" | "teacher";

export function prismaUserRoleToUiRole(role: Role): UiRole {
	if (role === "ADMIN") return "admin";
	if (role === "HOD") return "department";
	return "teacher";
}
