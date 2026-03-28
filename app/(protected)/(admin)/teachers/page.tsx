import { api } from "@/lib/api";
import type { Department } from "@/generated/prisma/client";
import type { PublicUser } from "@/lib/user";

import SubHeader from "@/components/sub-header";
import { DialogCardBtn } from "@/components/DialogCardBtn";
import TeacherForm from "./components/TeacherForm";
import TeachersListTable from "./components/TeachersListTable";
import { Paginationn } from "@/components/Pagination";
import { GetTeachers } from "@/lib/actions/GetTeachers";

export type TeacherWithDepartment = PublicUser & {
	department: Department;
};
const page = async ({
	searchParams,
}: {
	searchParams: Promise<{
		[key: string]: string; //don't need to specify exact keys
	}>;
}) => {
	const URL = "http://localhost:3000";
	const { page, pageSize, search, filter } = await searchParams;

	const { success, data, message } = await GetTeachers({
		page: Number(page) || 1,
		pageSize: Number(pageSize) || 10,
		search: search || "",
		filter,
	});
	const total = data?.total ?? 0;

	// const user = await auth();

	const { teachers = [] } = data || {};
	console.log("server teacher ", teachers);
	// let teachers: TeacherWithDepartment[] = [];
	// try {
	// 	const res = await api.users.getAll();
	// 	teachers = res?.data?.users || [];
	// 	console.log("teacher list; ", teachers);
	// } catch (error: any) {
	// 	throw error.message;
	// }

	return (
		<>
			<SubHeader
				placeholder="Search teacher by name or email"
				exportEndpoint={`${URL}/api/teachers/export`}
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
				<main className="space-y-5">
					<div className=" flex items-center justify-center max-w-5xl mx-auto">
						<TeachersListTable teachers={teachers} />
					</div>
					<Paginationn
						page={Number(page) || 1}
						pageSize={Number(pageSize) || 10}
						total={total}
					/>
				</main>
			) : (
				<div className="flex items-center justify-center min-h-[50vh]">
					<p className="text-gray-500">No teachers found.</p>
				</div>
			)}
		</>
	);
};

export default page;
