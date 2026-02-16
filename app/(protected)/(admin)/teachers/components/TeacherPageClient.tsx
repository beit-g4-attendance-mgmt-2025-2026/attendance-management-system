"use client";

import { useState } from "react";
import { Paginationn } from "@/components/Pagination";
import TeachersListTable from "./TeachersListTable";
import { TeacherProfileCard } from "./TeacherProfileCard";
import { User } from "@/generated/prisma/client";

export interface TeacherPageClientProps {
	initialTeachers: User[];
}

const TeacherPageClient = ({ initialTeachers }: TeacherPageClientProps) => {
	const [teachers, setTeachers] = useState<User[]>(initialTeachers);
	const [selectedTeacher, setSelectedTeacher] = useState<User | null>(
		initialTeachers ? initialTeachers[0] : null,
	);

	return (
		<main>
			<div className="flex gap-5 w-full">
				<div className=" flex flex-col justify-between">
					<TeachersListTable
						teachers={teachers}
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

export default TeacherPageClient;
