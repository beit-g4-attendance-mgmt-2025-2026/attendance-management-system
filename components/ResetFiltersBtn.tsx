"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

type ResetFiltersBtnProps = {
	keys: string[];
	label?: string;
	className?: string;
};

export function ResetFiltersBtn({
	keys,
	label = "Reset",
	className,
}: ResetFiltersBtnProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const hasActiveFilter = keys.some((key) => {
		const value = searchParams.get(key);
		return value != null && value !== "";
	});

	const handleReset = () => {
		const currentQuery = queryString.parse(searchParams.toString());
		const updatedQuery = { ...currentQuery } as Record<string, unknown>;

		keys.forEach((key) => {
			delete updatedQuery[key];
		});
		delete updatedQuery.page;

		const url = queryString.stringifyUrl(
			{ url: pathname, query: updatedQuery },
			{ skipNull: true, skipEmptyString: true },
		);

		router.push(url);
	};

	return (
		<button
			type="button"
			className={`cursor-pointer text-sm ${hasActiveFilter ? "text-sky-600" : "text-gray-400"} font-semibold  ${className ?? ""}`}
			onClick={handleReset}
			disabled={!hasActiveFilter}
		>
			{label}
		</button>
	);
}
