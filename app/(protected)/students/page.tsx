"use client";

import { useState } from "react";
import { Paginationn } from "@/components/Pagination";
import StudentsListTable from "./components/StudentListTable";
import SubHeader from "@/components/sub-header";
import { StudentProfileCard } from "./components/StudentProfileCard";
import { Student } from "@/types/index.types";
import { STUDENTS } from "@/constants/index.constants";

const page = () => {
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(
		null
	);

	return (
		<main>
			<SubHeader isTeacher={false} />

			<div className="flex justify-between">
				<div className="max-w-8/12">
					<StudentsListTable
						students={STUDENTS}
						selectedStudent={selectedStudent}
						onSelectStudent={setSelectedStudent}
					/>
					<div className="mt-6">
						<Paginationn />
					</div>
				</div>
				<div className="w-4/12 sticky top-0  h-svh  ">
					<StudentProfileCard student={selectedStudent} />
				</div>
			</div>
		</main>
	);
};

export default page;
