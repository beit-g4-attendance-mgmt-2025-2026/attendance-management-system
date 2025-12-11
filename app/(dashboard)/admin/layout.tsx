import { redirect } from "next/navigation";
export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const roles = ["super-admin", "admin", "teacher"];

	if (!roles.includes("super-admin")) {
		redirect("/unauthorized");
	}

	return <>{children}</>;
}
