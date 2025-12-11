import { redirect } from "next/navigation";

const layout = ({ children }: { children: React.ReactNode }) => {
	const roles = ["super-admin", "admin", "teacher"];

	if (!roles.includes("admin")) redirect("/unauthorized");

	return <>{children}</>;
};

export default layout;
