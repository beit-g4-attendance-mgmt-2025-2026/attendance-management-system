import SearchInput from "@/components/inputs/SearchInput";
import { Button } from "@/components/ui/button";
import React from "react";
import DepartmentsListTable from "./components/DepartmentsListTable";
import { DEPARTMENTS } from "@/constants/index.constants";
import Link from "next/link";

const page = () => {
	return (
		<div>
			<header className="flex justify-between items-center mb-6">
				<SearchInput
					placeholder="Search department by name"
					className="bg-gray-200 rounded-2xl  dark:bg-[#172139]"
				/>
				<div className="flex gap-3">
					<Button variant={"link"} className="text-sky-600">
						Export CSV
					</Button>
					<Button className="text-white bg-sky-600 hover:bg-sky-700 hover:text-white">
						<Link href={"departments/add"}>Add Department</Link>
					</Button>
				</div>
			</header>

			<main className="flex items-center justify-center max-w-5xl mx-auto">
				<DepartmentsListTable departments={DEPARTMENTS} />
			</main>
		</div>
	);
};

export default page;
