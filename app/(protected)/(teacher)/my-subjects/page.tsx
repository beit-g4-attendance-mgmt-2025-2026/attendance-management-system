import { DialogCardBtn } from "@/components/DialogCardBtn";
import { Paginationn } from "@/components/Pagination";
import SubHeader from "@/components/sub-header";
import SubjectCard from "@/components/SubjectCard";
import React from "react";
import SubjectForm from "../../(HOD)/(subject)/components/SubjectForm";
import {
	GetMySubjects,
	type MySubjectItem,
} from "@/lib/actions/GetMySubjects.actions";

export interface Subject {
	name: string;
	code: string;
	roomName: string | null;
	className: string;
	total: number;
}
const page = async ({
	searchParams,
}: {
	searchParams: Promise<{
		[key: string]: string;
	}>;
}) => {
	const { page, pageSize, search, filter, sort } = await searchParams;

	const { data } = await GetMySubjects({
		page: Number(page) || 1,
		pageSize: Number(pageSize) || 9,
		search: search || "",
		filter: filter || "",
		sort: sort || "",
	});

	const mySubjects: MySubjectItem[] = data?.mySubjects ?? [];
	const total = data?.total ?? 0;
	const currentPage = Number(page) || 1;
	const currentPageSize = Number(pageSize) || 9;

	const subjects: Subject[] = mySubjects.map((subject) => ({
		name: subject.name,
		code: subject.code,
		roomName: subject.roomName,
		className: subject.className,
		total: subject.total,
	}));

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
			{subjects.length > 0 ? (
				<main className="space-y-6">
					<div className="grid md:grid-cols-3 gap-10">
						{subjects.map((subject) => (
							<SubjectCard key={subject.code} subject={subject} />
						))}
					</div>
					<Paginationn
						page={currentPage}
						pageSize={currentPageSize}
						total={total}
					/>
				</main>
			) : (
				<div className="flex items-center justify-center min-h-[40vh]">
					<p className="text-gray-500">You have no subjects.</p>
				</div>
			)}
		</div>
	);
};

export default page;
