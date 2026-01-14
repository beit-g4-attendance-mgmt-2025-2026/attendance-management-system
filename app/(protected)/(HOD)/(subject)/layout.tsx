import SubHeader from "@/components/sub-header";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main>
			<SubHeader
				placeholder="Search for a subject by name or code"
				href="/subjects/add"
				name="Add Subject"
			/>
			{children}
		</main>
	);
};

export default layout;
