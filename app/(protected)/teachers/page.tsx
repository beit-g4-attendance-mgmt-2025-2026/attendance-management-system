"use client";

import { useState } from "react";
import TeacherNavbar from "@/components/TeacherNavbar";
import TeacherListTable from "./components/TeachersListTable";
import { Paginationn } from "@/components/Pagination";
import { TeacherProfileCard } from "./components/TeacherProfileCard";

interface Teacher {
	id: string;
	name: string;
	username: string;
	email: string;
	gender: string;
	department: string;
	role: string;
	dateOfBirth: string;
	phone: string;
}

const teachers: Teacher[] = [
	{
		id: "1",
		name: "Jhon Doe",
		username: "john123",
		email: "john@email.com",
		gender: "Male",
		department: "IT",
		role: "Head of Department",
		dateOfBirth: "19/1/1992",
		phone: "+1-234-567-8900",
	},
	{
		id: "2",
		name: "Cody Fisher",
		username: "codyfisher001",
		email: "cody.fisher@email.com",
		gender: "Female",
		department: "Computer Engineering & Information ",
		role: "Teacher",
		dateOfBirth: "15/5/1988",
		phone: "+1-234-567-8901",
	},
	{
		id: "3",
		name: "Sarah Smith",
		username: "sarah.smith",
		email: "sarah@email.com",
		gender: "Female",
		department: "IT",
		role: "Teacher",
		dateOfBirth: "22/8/1990",
		phone: "+1-234-567-8902",
	},
];

const page = () => {
	const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(
		null
	);

	return (
		<main>
			<TeacherNavbar />

			<div className="flex justify-between">
				<div className="max-w-8/12">
					<TeacherListTable
						teachers={teachers}
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
