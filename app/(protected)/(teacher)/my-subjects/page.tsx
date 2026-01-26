import { DialogCardBtn } from "@/components/DialogCardBtn";
import SubHeader from "@/components/sub-header";
import SubjectCard from "@/components/SubjectCard";
import React from "react";
import SubjectForm from "../../(HOD)/(subject)/components/SubjectForm";

export interface Subject {
	name: string;
	code: string;
	room: string;
	total: number;
}
const page = () => {
	const subjects: Subject[] = [
		{
			name: "Modern Control System",
			code: "IT-42017",
			room: "2-3",
			total: 22,
		},
		{
			name: "Database Management Systems",
			code: "IT-42011",
			room: "1-2",
			total: 30,
		},
		{
			name: "Operating Systems",
			code: "IT-42009",
			room: "3-1",
			total: 28,
		},
		{
			name: "Computer Networks",
			code: "IT-42013",
			room: "2-1",
			total: 26,
		},
		{
			name: "Software Engineering",
			code: "IT-42005",
			room: "1-4",
			total: 34,
		},
		{
			name: "Artificial Intelligence",
			code: "IT-42019",
			room: "4-2",
			total: 20,
		},
		{
			name: "Web Application Development",
			code: "IT-42015",
			room: "Lab-1",
			total: 24,
		},
		{
			name: "Data Structures & Algorithms",
			code: "IT-42003",
			room: "3-2",
			total: 32,
		},
	];

	return (
		<div>
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
			<div className="grid md:grid-cols-3 gap-10">
				{subjects.map((subject, index) => (
					<SubjectCard key={index} subject={subject} />
				))}
			</div>
		</div>
	);
};

export default page;
