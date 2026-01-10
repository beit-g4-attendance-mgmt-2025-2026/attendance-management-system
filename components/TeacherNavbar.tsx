import { departmentNames } from "@/constants/index.constants";
import { Filter } from "./Filter";

import { Button } from "./ui/button";
import SearchInput from "./inputs/SearchInput";

const TeacherNavbar = () => {
	return (
		<nav className="flex justify-between items-center mb-10 mx-auto w-auto">
			<div className="flex items-center px-4 py-1 rounded-md gap-4 shadow-sm border border-muted/50 w-2xl">
				<Filter filterName={departmentNames} />
				<SearchInput placeholder="Search for a teacher by name or email" />
			</div>
			<div className="flex gap-4">
				<Button variant={"link"} className="cursor-pointer">
					Export CSV
				</Button>
				<Button className="cursor-pointer text-white ">
					Add Teachers
				</Button>
			</div>
		</nav>
	);
};

export default TeacherNavbar;
