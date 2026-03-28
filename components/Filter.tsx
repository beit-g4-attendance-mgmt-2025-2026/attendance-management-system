"use client";

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import queryString from "query-string";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export type FilterOption = string | { label: string; value: string };

export function Filter({
	filterName,
	label = "Department",
	queryKey = "filter",
}: {
	filterName: FilterOption[];
	label?: string;
	queryKey?: string;
}) {
	const [open, setOpen] = useState(false); //drop down icon

	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedFilter = searchParams.get(queryKey) || "";

	const normalizedOptions = filterName.map((option) =>
		typeof option === "string"
			? { label: option, value: option }
			: { label: option.label, value: option.value },
	);

	const handleFilter = (filterType: string) => {
		const currentQuery = queryString.parse(window.location.search);
		const updatedQuery = {
			...currentQuery,
			[queryKey]: filterType === selectedFilter ? "" : filterType,
			page: 1,
		};
		const url = queryString.stringifyUrl(
			{
				url: window.location.pathname,
				query: updatedQuery,
			},
			{ skipNull: true, skipEmptyString: true },
		);
		router.push(url);
	};

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<button className="flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 hover:bg-transparent">
					<span className="select-text">{label}</span>
					<ChevronDown
						size={16}
						className={`transition-transform ${open ? "rotate-180" : ""}`}
					/>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel className="font-semibold">
					Filter
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{normalizedOptions.map((option) => (
					<DropdownMenuCheckboxItem
						checked={selectedFilter === option.value}
						key={option.value}
						onClick={() => handleFilter(option.value)}
						className={`${selectedFilter === option.value ? "text-blue-600" : ""} cursor-pointer font-semibold`}
					>
						{option.label}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
