"use client";

import { useState } from "react";
import { Paginationn } from "@/components/Pagination";
import StudentsListTable from "./components/StudentListTable";
import SubHeader from "@/components/sub-header";
import { StudentProfileCard } from "./components/StudentProfileCard";
import { Student } from "@/types/index.types";

const students: Student[] = [
	{
		id: "1",
		name: "Jhon Doe",
		student_id: "III-IT-1",
		email: "john@email.com",
		gender: "Male",
		department: "IT",
		semester: "First Semester",
		dateOfBirth: "19/1/1992",
		phone: "+1-234-567-8900",
	},
	{
		id: "2",
		name: "Jane Smith",
		student_id: "III-IT-2",
		email: "johnsmith@email.com",
		gender: "Male",
		department: "IT",
		semester: "First Semester",
		dateOfBirth: "19/1/2003",
		phone: "+1-234-567-8900",
	},
	{
		id: "3",
		name: "Alice Johnson",
		student_id: "III-IT-4",
		email: "alice@email.com",
		gender: "Male",
		department: "IT",
		semester: "First Semester",
		dateOfBirth: "19/1/2000",
		phone: "+1-234-567-8900",
	},
	{
		id: "4",
		name: "Jhon Doe",
		student_id: "IV-IT-20",
		email: "john@email.com",
		gender: "Male",
		department: "IT",
		semester: "Second Semester",
		dateOfBirth: "19/1/2002",
		phone: "+1-234-567-8900",
	},
];

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
						students={students}
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
