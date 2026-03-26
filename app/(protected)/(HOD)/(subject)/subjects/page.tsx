import React from "react";
import SubjectListTable from "../components/SubjectListTable";
import { Paginationn } from "@/components/Pagination";
import { GetSubjects } from "@/lib/actions/GetSubjects.actions";
import SubHeader from "@/components/sub-header";
import { DialogCardBtn } from "@/components/DialogCardBtn";
import SubjectForm from "../components/SubjectForm";

const page = async ({
	searchParams,
}: {
	searchParams: Promise<{
		[key: string]: string; //don't need to specify exact keys
	}>;
}) => {
	const { page, pageSize, search, filter } = await searchParams;

	const { data } = await GetSubjects({
		page: Number(page) || 1,
		pageSize: Number(pageSize) || 10,
		search: search || "",
		filter,
	});
	const total = data?.total ?? 0;

	// const user = await auth();

	const { subjects = [] } = data || {};
	console.log("server subjects : ", subjects);
	return (
		<>
			<SubHeader
				placeholder="Search for a subject by name"
				exportEndpoint="/api/subjects/export"
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
			{subjects?.length ? (
				<main className="space-y-5">
					<div className=" flex items-center justify-center max-w-5xl mx-auto">
						<SubjectListTable subjects={subjects} />
					</div>
					<Paginationn
						page={Number(page) || 1}
						pageSize={Number(pageSize) || 10}
						total={total}
					/>
				</main>
			) : (
				<div className="flex items-center justify-center min-h-[50vh]">
					<p className="text-gray-500">No subjects found.</p>
				</div>
			)}
		</>
	);
};

export default page;
