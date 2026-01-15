import ClassCard from "@/components/ClassCard";
import { DialogCardBtn } from "@/components/DialogCardBtn";
import SearchInput from "@/components/inputs/SearchInput";
import React from "react";
import SubjectForm from "../../(HOD)/(subject)/components/SubjectForm";
import ClassForm from "@/components/ClassForm";

export interface ClassItem {
	id: string;
	name: string;
	familyTeacher: string;
	male: number;
	female: number;
	total: number;
}
const page = () => {
	const myclass: ClassItem = {
		id: "first-year-first-sem",
		name: "First Year (First Semester)",
		familyTeacher: "Dr. Thida Khaing",
		male: 32,
		female: 24,
		total: 56,
	};

	return (
		<div>
			<header className="flex justify-between items-center mb-6">
				<SearchInput
					placeholder="Search for a class by name"
					className="bg-gray-200 rounded-2xl  dark:bg-[#172139]"
				/>
				<div className="flex gap-3">
					<DialogCardBtn triggerName="Add Class" title="Add Class">
						<ClassForm isEdit={false} />
					</DialogCardBtn>
				</div>
			</header>
			<div className="grid md:grid-cols-3 gap-10">
				<ClassCard classItem={myclass} variant="my-class" />
			</div>
		</div>
	);
};

export default page;
