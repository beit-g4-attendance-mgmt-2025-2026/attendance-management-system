"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

type Role = "admin" | "department" | "teacher";

const ROLE_ACCESS: Record<Role, string[]> = {
	admin: ["dashboard", "department-list", "teacher-list", "student-list"],
	department: [
		"dashboard",
		"all-classes",
		"teacher-list",
		"student-list",
		"report",
		"my-class",
		"subjects",
	],
	teacher: ["dashboard", "my-class", "subjects", "report"],
};

export default function ClientProtected({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();

	const role: Role = Cookies.get("role") as Role;

	useEffect(() => {
		if (!role) {
			router.replace("/login");
			return;
		}

		const segment = pathname.split("/").filter(Boolean).pop() || "";

		const allowed = ROLE_ACCESS[role].some((r) => segment.startsWith(r));

		if (!allowed) {
			router.replace("/unauthorized");
		}
	}, [pathname, role, router]);

	return children;
}
