import { api } from "@/lib/api";
import TeacherPageClient from "./components/TeacherPageClient";
import type { Department, User } from "@/generated/prisma/client";
import SubHeader from "@/components/sub-header";
import { DialogCardBtn } from "@/components/DialogCardBtn";
import TeacherForm from "./components/TeacherForm";

export type TeacherWithDepartment = User & {
	department: Department;
};
const page = async () => {
	let teachers: TeacherWithDepartment[] = [];
	try {
		const res = await api.users.getAll();

		teachers = res?.data?.users || [];
		console.log("teacher list; ", teachers);
	} catch (error: any) {
		throw error.message;
	}

	return (
		<>
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
			{teachers?.length ? (
				<TeacherPageClient initialTeachers={teachers} />
			) : (
				<div className="flex items-center justify-center min-h-[50vh]">
					<p className="text-gray-500">No teachers found.</p>
				</div>
			)}
		</>
	);
};

export default page;
