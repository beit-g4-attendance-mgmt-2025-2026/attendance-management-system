import { departmentNames } from "@/constants/index.constants";
import { Filter } from "./Filter";
import { Button } from "./ui/button";
import SearchInput from "./inputs/SearchInput";
import { ExportCsvBtn } from "./ExportCsvBtn";

const SubHeader = ({
	placeholder,
	dialogButton,
	exportEndpoint,
}: {
	placeholder: string;
	dialogButton: React.ReactNode;
	exportEndpoint?: string;
}) => {
	return (
		<nav className="flex justify-between items-center mb-10 mx-auto w-auto">
			<div className="flex items-center px-4 py-1  gap-4 shadow-sm border border-muted/50 dark:bg-[#172139] bg-gray-200 rounded-2xl">
				<Filter filterName={departmentNames} />
				<SearchInput placeholder={placeholder} />
			</div>
			<div className="flex gap-4">
				{exportEndpoint && (
					<ExportCsvBtn
						endpoint={exportEndpoint}
						allowedParams={["search", "filter"]}
					/>
				)}

				{dialogButton}
			</div>
		</nav>
	);
};

export default SubHeader;
