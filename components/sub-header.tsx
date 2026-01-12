import { departmentNames } from "@/constants/index.constants";
import { Filter } from "./Filter";

import { Button } from "./ui/button";
import SearchInput from "./inputs/SearchInput";
import Link from "next/link";

const SubHeader = ({ isTeacher }: { isTeacher: boolean }) => {
	return (
		<nav className="flex justify-between items-center mb-10 mx-auto w-auto">
			<div className="flex items-center px-4 py-1 rounded-md gap-4 shadow-sm border border-muted/50 w-2xl">
				<Filter filterName={departmentNames} />
				<SearchInput
					placeholder={`${
						isTeacher
							? "Search for a teacher by name or email"
							: "Search for a student by name or email"
					}`}
				/>
			</div>
			<div className="flex gap-4">
				<Button variant={"link"} className="cursor-pointer">
					Export CSV
				</Button>
				<Button className="cursor-pointer text-white ">
					<Link
						href={`${isTeacher ? "teachers/add" : "students/add"}`}
					>
						{isTeacher ? "Add Teacher" : "Add Student"}
					</Link>
				</Button>
			</div>
		</nav>
	);
};

export default SubHeader;
