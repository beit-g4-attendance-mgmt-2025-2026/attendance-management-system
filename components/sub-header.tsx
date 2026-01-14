import { departmentNames } from "@/constants/index.constants";
import { Filter } from "./Filter";

import { Button } from "./ui/button";
import SearchInput from "./inputs/SearchInput";
import Link from "next/link";

const SubHeader = ({
	placeholder,
	href,
	name,
}: {
	placeholder: string;
	href: string;
	name: string;
}) => {
	return (
		<nav className="flex justify-between items-center mb-10 mx-auto w-auto">
			<div className="flex items-center px-4 py-1  gap-4 shadow-sm border border-muted/50 dark:bg-[#172139] bg-gray-200 rounded-2xl">
				<Filter filterName={departmentNames} />
				<SearchInput placeholder={placeholder} />
			</div>
			<div className="flex gap-4">
				<Button
					variant={"link"}
					className="cursor-pointer text-sky-600"
				>
					Export CSV
				</Button>
				<Button className="cursor-pointer text-white bg-sky-600 hover:bg-sky-700 hover:text-white">
					<Link href={href}>{name}</Link>
				</Button>
			</div>
		</nav>
	);
};

export default SubHeader;
