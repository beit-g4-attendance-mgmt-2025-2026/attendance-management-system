"use client";

import AdminDashboard from "./components/AdminDashboard";
import HodDashboard from "./components/HodDashboard";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function DashboardPage() {
	const uiRole = useAuthStore((s) => s.uiRole);
	const status = useAuthStore((s) => s.status);

	if (status !== "ready" || !uiRole) {
		return null;
	}

	if (uiRole === "admin") return <AdminDashboard />;
	return <HodDashboard />;
}
