import { redirect } from "next/navigation";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
	const roles = ["super-admin", "admin", "teacher"];

	if (!roles.includes("teacher")) redirect("/unauthorized");

	return <>{children}</>;
};

export default layout;
