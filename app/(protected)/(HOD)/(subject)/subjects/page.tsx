import React from "react";
import SubjectListTable from "../components/SubjectListTable";
import { SUBJECTS } from "@/constants/index.constants";
import { Paginationn } from "@/components/Pagination";

const page = () => {
	return (
		<div>
			<SubjectListTable subjects={SUBJECTS} />
			<div className="mt-6">
				<Paginationn />
			</div>
		</div>
	);
};

export default page;
