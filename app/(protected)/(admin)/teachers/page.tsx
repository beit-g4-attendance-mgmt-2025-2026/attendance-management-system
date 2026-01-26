"use client";

import { useState } from "react";
import TeacherListTable from "./components/TeachersListTable";
import { Paginationn } from "@/components/Pagination";
import { TeacherProfileCard } from "./components/TeacherProfileCard";
import SubHeader from "@/components/sub-header";
import { TEACHERS } from "@/constants/index.constants";
import { Teacher } from "@/types/index.types";
import { DialogCardBtn } from "@/components/DialogCardBtn";
import TeacherForm from "./components/TeacherForm";

const page = () => {
	const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(
		null
	);

	return (
		<main>
			<SubHeader
				placeholder="Search for a teacher by name or email"
				dialogButton={
					<DialogCardBtn
						triggerName="Add Teacher"
						title="Add Teacher"
						description="Enter teacher details"
					>
						<TeacherForm isEdit={false} />
					</DialogCardBtn>
				}
			/>

			<div className="flex justify-between w-full">
				<div className=" flex flex-col justify-between">
					<TeacherListTable
						teachers={TEACHERS}
						selectedTeacher={selectedTeacher}
						onSelectTeacher={setSelectedTeacher}
					/>
					<div>
						<Paginationn />
					</div>
				</div>
				{/* <div className="w-4/12 sticky top-0  h-svh  "> */}
				<TeacherProfileCard teacher={selectedTeacher} />
				{/* </div> */}
			</div>
		</main>
	);
};

export default page;
