import { departmentNames } from "@/constants/index.constants";
import { Filter, type FilterOption } from "./Filter";
import SearchInput from "./inputs/SearchInput";
import { ExportCsvBtn } from "./ExportCsvBtn";
import { ResetFiltersBtn } from "./ResetFiltersBtn";

const SubHeader = ({
	placeholder,
	dialogButton,
	exportEndpoint,
	filters = [],
	showDepartmentFilter = true,
}: {
	placeholder: string;
	dialogButton: React.ReactNode;
	exportEndpoint?: string;
	filters?: Array<{
		label: string;
		queryKey: string;
		options: FilterOption[];
	}>;
	showDepartmentFilter?: boolean;
}) => {
	const allFilters = [
		...(showDepartmentFilter
			? [
					{
						label: "Department",
						queryKey: "filter",
						options: departmentNames as FilterOption[],
					},
				]
			: []),
		...filters,
	];

	const filterParams = Array.from(new Set(allFilters.map((item) => item.queryKey)));
	const exportParams = Array.from(new Set(["search", ...filterParams]));

	return (
		<nav className="flex justify-between items-center mb-10 mx-auto w-auto">
			<div className="flex items-center px-4 py-1  gap-4 shadow-sm border border-muted/50 dark:bg-[#172139] bg-gray-200 rounded-2xl">
				{allFilters.map((item) => (
					<Filter
						key={item.queryKey}
						filterName={item.options}
						label={item.label}
						queryKey={item.queryKey}
					/>
				))}
				<SearchInput placeholder={placeholder} />
				{filterParams.length > 0 && (
					<ResetFiltersBtn keys={filterParams} label="Reset Filters" />
				)}
			</div>
			<div className="flex gap-4">
				{exportEndpoint && (
					<ExportCsvBtn
						endpoint={exportEndpoint}
						allowedParams={exportParams}
					/>
				)}

				{dialogButton}
			</div>
		</nav>
	);
};

export default SubHeader;
