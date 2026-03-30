"use client";

import { AuthStoreSync } from "@/components/auth-store-sync";
import type { UiRole } from "@/lib/auth-ui";
import { useAuthStore } from "@/lib/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const ROLE_ACCESS: Record<UiRole, string[]> = {
	admin: [
		"dashboard",
		"departments",
		"teachers",
		"students",
		"academic-years",
		"head-of-department",
		"settings",
	],
	department: [
		"dashboard",
		"teachers",
		"students",
		"classes",
		"subjects",
		"my-class",
		"my-subjects",
	],
	teacher: ["dashboard", "my-class", "my-subjects"],
};

export default function ClientProtected({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const status = useAuthStore((s) => s.status);
	const uiRole = useAuthStore((s) => s.uiRole);

	useEffect(() => {
		if (status === "idle" || status === "loading") return;

		if (status === "error" || !uiRole) {
			router.replace("/login");
			return;
		}

		const pathSegments = pathname.split("/").filter(Boolean);
		const routePath = pathSegments.join("/");

		const allowed = ROLE_ACCESS[uiRole].some(
			(r) => routePath === r || routePath.startsWith(r + "/"),
		);

		if (!allowed) {
			router.replace("/unauthorized");
		}
	}, [pathname, router, status, uiRole]);

	return (
		<>
			<AuthStoreSync />
			{children}
		</>
	);
}
