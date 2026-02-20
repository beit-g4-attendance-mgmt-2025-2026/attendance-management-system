"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";

type ExportCsvButtonProps = {
	endpoint: string;
	label?: string;
	className?: string;
	allowedParams?: string[]; // optional: only include these params
};

export function ExportCsvBtn({
	endpoint,
	label = "Export CSV",
	className,
	allowedParams,
}: ExportCsvButtonProps) {
	const searchParams = useSearchParams();
	const currentQuery = queryString.parse(searchParams.toString());

	const query = allowedParams?.length
		? Object.fromEntries(
				Object.entries(currentQuery).filter(([k]) =>
					allowedParams.includes(k),
				),
			)
		: currentQuery;

	const url = queryString.stringifyUrl(
		{ url: endpoint, query },
		{ skipNull: true, skipEmptyString: true },
	);

	return (
		<Button
			variant="link"
			className={`cursor-pointer text-sky-600 ${className ?? ""}`}
			onClick={() => {
				window.location.href = url;
			}}
		>
			{label}
		</Button>
	);
}
