import ClassCard from "@/components/ClassCard";
import React from "react";
import ClassForm from "@/components/ClassForm";
import SearchInput from "@/components/inputs/SearchInput";
import { DialogCardBtn } from "@/components/DialogCardBtn";
import { ExportCsvBtn } from "@/components/ExportCsvBtn";
import { GetMyClass } from "@/lib/actions/GetMyClass.actions";

export interface MyClassItem {
	id: string;
	name: string;
	familyTeacher: string;
	male: number;
	female: number;
	total: number;
}
const page = async ({
	searchParams,
}: {
	searchParams: Promise<{
		[key: string]: string; //don't need to specify exact keys
	}>;
}) => {
	const { search } = await searchParams;

	const { data } = await GetMyClass({
		search: search || "",
	});
	// const total = data?.total ?? 0;

	// const user = await auth();

	const myClass: MyClassItem | null = data?.myClass ?? null;
	console.log("server myClass ", myClass);
	// const myclass: ClassItem = {
	// 	id: "first-year-first-sem",
	// 	name: "First Year (First Semester)",
	// 	familyTeacher: "Dr. Thida Khaing",
	// 	male: 32,
	// 	female: 24,
	// 	total: 56,
	// };

	return (
		<>
			<header className="flex justify-between items-center mb-6">
				<SearchInput
					placeholder="Search for a class by name"
					className="bg-gray-200 rounded-2xl  dark:bg-[#172139]"
				/>
				<div className="flex gap-3">
					<ExportCsvBtn
						endpoint="/api/my-class/export"
						allowedParams={["search"]}
					/>
					<DialogCardBtn triggerName="Add Class" title="Add Class">
						<ClassForm isEdit={false} />
					</DialogCardBtn>
				</div>
			</header>
			{myClass ? (
				<div className="grid md:grid-cols-3 gap-10">
					<ClassCard classItem={myClass} variant="my-class" />
				</div>
			) : (
				<div className="flex items-center justify-center min-h-[50vh]">
					<p className="text-gray-500">Class not found!</p>
				</div>
			)}
		</>
	);
};

export default page;
