import React from "react";
import SearchInput from "@/components/inputs/SearchInput";
import { ExportCsvBtn } from "@/components/ExportCsvBtn";
import { GetMyClass, type MyClassItem } from "@/lib/actions/GetMyClass.actions";
import MyClassCards from "./components/MyClassCards";

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
	const myClasses: MyClassItem[] = data?.myClasses ?? [];

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
						disabled={myClasses.length === 0}
					/>
				</div>
			</header>
			<main className="space-y-8">
				<MyClassCards classes={myClasses} />
			</main>
		</>
	);
};

export default page;
