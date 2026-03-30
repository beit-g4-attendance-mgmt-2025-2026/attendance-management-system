"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useState } from "react";

type ExportCsvButtonProps = {
	endpoint: string;
	label?: string;
	exportingLabel?: string;
	className?: string;
	allowedParams?: string[]; // optional: only include these params
	fixedQuery?: Record<string, string | number | boolean>;
	disabled?: boolean;
};

export function ExportCsvBtn({
	endpoint,
	label = "Export CSV",
	exportingLabel = "Exporting...",
	className,
	allowedParams,
	fixedQuery,
	disabled = false,
}: ExportCsvButtonProps) {
	const [isExporting, setIsExporting] = useState(false);
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
		{
			url: endpoint,
			query: {
				...query,
				...fixedQuery,
			},
		},
		{ skipNull: true, skipEmptyString: true },
	);
	const isDisabled = disabled || isExporting;

	return (
		<Button
			variant="link"
			className={`cursor-pointer text-sky-600 ${className ?? ""}`}
			disabled={isDisabled}
			aria-disabled={isDisabled}
			onClick={async () => {
				if (isDisabled) return;
				try {
					setIsExporting(true);
					const res = await fetch(url, {
						method: "GET",
						credentials: "include",
					});
					if (!res.ok) throw new Error("Failed to export CSV");

					const blob = await res.blob();
					const disposition = res.headers.get("content-disposition");
					const filenameMatch = disposition?.match(
						/filename\*=UTF-8''([^;]+)|filename=\"?([^"]+)\"?/i,
					);
					const filename = filenameMatch
						? decodeURIComponent(
								filenameMatch[1] || filenameMatch[2],
							)
						: "export.csv";

					const blobUrl = window.URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = blobUrl;
					a.download = filename;
					document.body.appendChild(a);
					a.click();
					a.remove();
					window.URL.revokeObjectURL(blobUrl);
				} finally {
					setIsExporting(false);
				}
			}}
		>
			{isExporting ? exportingLabel : label}
		</Button>
	);
}
