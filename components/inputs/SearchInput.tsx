"use client";
import { useEffect, useState, useTransition } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useDebounce } from "use-debounce";
import { Loader2, SearchIcon, X } from "lucide-react";
import { Input } from "../ui/input";

const SearchInput = ({
	placeholder,
	className,
}: {
	placeholder: string;
	className?: string;
}) => {
	const router = useRouter(); // get the current url
	const searchParams = useSearchParams();
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const [debouncedSearch] = useDebounce(search, 300); // delay the search by 300ms
	const [isPending, startTransition] = useTransition();
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
			{ skipNull: true, skipEmptyString: true },
		);
		// push url in transition to make "isPending" true
		startTransition(() => {
			router.push(url);
		});
	}, [debouncedSearch, router]);

	const handleClearSearch = () => {
		setSearch("");
	};

	return (
		<div className={`relative group ` + className}>
			<span className="absolute group-focus-within:text-primary inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground ">
				{isPending ? (
					<Loader2 size={21} className="animate-spin text-blue-600" />
				) : (
					<SearchIcon size={21} />
				)}
			</span>
			<Input
				className="pl-10 pr-9 border-none bg-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-transparent w-[300px] active:ring-0 active:ring-offset-0 active:border-transparent"
				value={search}
				onChange={(e: any) => setSearch(e.target.value)}
				placeholder={placeholder}
			/>
			{search && (
				<button
					type="button"
					onClick={handleClearSearch}
					className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
					aria-label="Clear search"
				>
					<X size={16} />
				</button>
			)}
		</div>
	);
};

export default SearchInput;
