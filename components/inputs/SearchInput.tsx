"use client";
import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useDebounce } from "use-debounce";
import { SearchIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "../ui/input";

const SearchInput = ({ placeholder }: { placeholder: string }) => {
	const router = useRouter(); // get the current url
	const searchParams = useSearchParams();
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const [debouncedSearch] = useDebounce(search, 300); // delay the search by 300ms
	useEffect(() => {
		const currentQuery = queryString.parse(window.location.search);
		const updatedQuery = {
			...currentQuery,
			search: debouncedSearch,
		};
		const url = queryString.stringifyUrl(
			{
				url: window.location.pathname,
				query: updatedQuery,
			},
			{ skipNull: true, skipEmptyString: true }
		);
		router.push(url);
	}, [debouncedSearch, router]);
	return (
		<div className="relative group ">
			<span className="absolute group-focus-within:text-primary inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground ">
				<SearchIcon size={21} />
			</span>
			<Input
				className="pl-10 bg-transparent border-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-transparent w-[300px]"
				value={search}
				onChange={(e: any) => setSearch(e.target.value)}
				placeholder={placeholder}
			/>
		</div>
	);
};

export default SearchInput;
