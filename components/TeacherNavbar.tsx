import { departmentNames } from "@/constants/index.constants";
import { Filter } from "./Filter";

import { Button } from "./ui/button";
import SearchInput from "./inputs/SearchInput";

const TeacherNavbar = () => {
	return (
		<main className="flex justify-between items-center mb-10">
			<div className="flex items-center px-4 py-1 rounded-md gap-4 shadow-sm border border-muted/50 w-2xl">
				<Filter filterName={departmentNames} />
				<SearchInput placeholder="Search for a teacher by name or email" />
			</div>
			<div className="flex gap-4">
				<Button variant={"link"} className="cursor-pointer">
					Export CSV
				</Button>
				<Button className="cursor-pointer">Add Teachers</Button>
			</div>
		</main>
	);
};

export default TeacherNavbar;
