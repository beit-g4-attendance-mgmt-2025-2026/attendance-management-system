"use client";

import AdminDashboard from "./AdminDashboard";
import HodDashboard from "./HodDashboard";
import TeacherDashboard from "./TeacherDashboard";
import Cookies from "js-cookie";

export default function DashboardPage() {
  const role = Cookies.get("role");
  console.log(role);

  if (role === "admin") return <AdminDashboard />;
  if (role === "department") return <HodDashboard />;
  return <TeacherDashboard />;
}
