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

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function Filter({ filterName }: { filterName: string[] }) {
	const [showStatusBar, setShowStatusBar] = useState<Checked>(true);
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
			{ skipNull: true, skipEmptyString: true }
		);
		router.push(url);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<span>Add filter</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Filter</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{filterName?.map((dept) => (
					<DropdownMenuCheckboxItem
						checked={filter === dept}
						onCheckedChange={setShowStatusBar}
						key={dept}
						onClick={() => handleFilter(dept)}
					>
						{dept}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
