import SubHeader from "@/components/sub-header";
import React from "react";
import SubjectForm from "./components/SubjectForm";
import { DialogCardBtn } from "@/components/DialogCardBtn";

const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main>
			<SubHeader
				placeholder="Search for a subject by name or code"
				dialogButton={
					<DialogCardBtn
						triggerName="Add Subject"
						title="Add Subject"
						description="Enter subject details"
					>
						<SubjectForm isEdit={false} />
					</DialogCardBtn>
				}
			/>
			{children}
		</main>
	);
};

export default layout;
