"use client";

import { useState } from "react";
import TeacherListTable from "./components/TeachersListTable";
import { Paginationn } from "@/components/Pagination";
import { TeacherProfileCard } from "./components/TeacherProfileCard";
import SubHeader from "@/components/sub-header";
import { TEACHERS } from "@/constants/index.constants";
import { Teacher } from "@/types/index.types";

const page = () => {
	const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(
		null
	);

	return (
		<main>
			<SubHeader isTeacher={true} />

			<div className="flex justify-between">
				<div className="max-w-8/12">
					<TeacherListTable
						teachers={TEACHERS}
						selectedTeacher={selectedTeacher}
						onSelectTeacher={setSelectedTeacher}
					/>
					<div className="mt-6">
						<Paginationn />
					</div>
				</div>
				<div className="w-4/12 sticky top-0  h-svh  ">
					<TeacherProfileCard teacher={selectedTeacher} />
				</div>
			</div>
		</main>
	);
};

export default page;
