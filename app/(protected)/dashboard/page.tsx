"use client";

import AdminDashboard from "./components/AdminDashboard";
import HodDashboard from "./components/HodDashboard";
// import TeacherDashboard from "./components/TeacherDashboard";
import Cookies from "js-cookie";

export default function DashboardPage() {
	const role = Cookies.get("role");
	console.log(role);

	if (role === "admin") return <AdminDashboard />;
	// if (role === "department") return <HodDashboard />;
	return <HodDashboard />;
}
