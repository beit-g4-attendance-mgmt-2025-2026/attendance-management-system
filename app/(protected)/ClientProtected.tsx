"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

type Role = "admin" | "department" | "teacher";

const ROLE_ACCESS: Record<Role, string[]> = {
	admin: ["dashboard", "department-list", "teachers", "student-list"],
	department: [
		"dashboard",
		"all-classes",
		"teachers",
		"teachers/add",
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

	const role: Role = "admin"; //Cookies.get("role") as Role;

	useEffect(() => {
		if (!role) {
			router.replace("/login");
			return;
		}

		// Remove leading/trailing slashes and split
		const pathSegments = pathname.split("/").filter(Boolean);
		// Get everything after "protected" in the path
		const protectedIndex = pathSegments.indexOf("protected");
		const routePath =
			protectedIndex !== -1
				? pathSegments.slice(protectedIndex + 1).join("/")
				: pathSegments.join("/");

		const allowed = ROLE_ACCESS[role].some((r) => {
			// Exact match or starts with the route followed by /
			return routePath === r || routePath.startsWith(r + "/");
		});

		if (!allowed) {
			router.replace("/unauthorized");
		}
	}, [pathname, role, router]);

	return children;
}
