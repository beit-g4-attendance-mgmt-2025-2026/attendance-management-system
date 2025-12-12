"use client";
import AdminDashboard from "./AdminDashboard";
import HodDashboard from "./HodDashboard";
import TeacherDashboard from "./TeacherDashboard";

export default function DashboardPage() {
  const role = "admin";

  if (role === "admin") return <AdminDashboard />;
  if (role === "department") return <HodDashboard />;
  return <TeacherDashboard />;
}
