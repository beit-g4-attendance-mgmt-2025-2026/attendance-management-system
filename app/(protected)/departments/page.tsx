import SearchInput from "@/components/inputs/SearchInput";
import { Button } from "@/components/ui/button";
import React from "react";

const page = () => {
	return (
		<div>
			<header className="flex justify-between items-center">
				<SearchInput
					placeholder="Search department by name"
					className="bg-gray-200 rounded-2xl dark:bg-[#172139]"
				/>
				<div className="flex gap-3">
					<Button variant={"link"}>Export CSV</Button>
					<Button className="text-white">Add Department</Button>
				</div>
			</header>
		</div>
	);
};

export default page;
