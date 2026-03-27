"use client";

import { type DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

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
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function Filter({ filterName }: { filterName: string[] }) {
	const [showStatusBar, setShowStatusBar] = useState<Checked>(true);
	const [open, setOpen] = useState(false); //drop down icon

	const router = useRouter();
	const searchParams = useSearchParams();
	const [filter, setFilter] = useState(searchParams.get("filter") || "");
	const handleFilter = (filterType: string) => {
		// check if the filter is already selected
		if (filter === filterType) {
			setFilter("");
		} else {
			setFilter(filterType);
		}
		const currentQuery = queryString.parse(window.location.search);
		const updatedQuery = {
			...currentQuery,
			filter: filterType === filter ? "" : filterType,
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
					<span className="select-text">Department</span>
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
				{filterName?.map((dept) => (
					<DropdownMenuCheckboxItem
						checked={filter === dept}
						onCheckedChange={setShowStatusBar}
						key={dept}
						onClick={() => handleFilter(dept)}
						className={`${filter === dept ? "text-blue-600" : ""} cursor-pointer font-semibold`}
					>
						{dept}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
