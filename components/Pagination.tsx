"use client";

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import queryString from "query-string";

export function Paginationn({
	page,
	pageSize,
	total,
}: {
	page: number;
	pageSize: number;
	total: number;
}) {
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	if (totalPages <= 1) return null;

	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentQuery = queryString.parse(searchParams.toString());

	const buildUrl = (p: number) =>
		queryString.stringifyUrl(
			{ url: pathname, query: { ...currentQuery, page: p, pageSize } },
			{ skipNull: true, skipEmptyString: true },
		);

	// Always show 3 pages (or less if totalPages < 3)
	let start = Math.max(1, page - 1);
	let end = Math.min(totalPages, start + 2);
	start = Math.max(1, end - 2);

	const pages = [];
	for (let p = start; p <= end; p++) pages.push(p);

	return (
		<Pagination>
			<PaginationContent>
				{page > 1 && (
					<PaginationItem>
						<PaginationPrevious href={buildUrl(page - 1)} />
					</PaginationItem>
				)}

				{pages.map((p) => (
					<PaginationItem key={p}>
						<PaginationLink
							href={buildUrl(p)}
							isActive={p === page}
						>
							{p}
						</PaginationLink>
					</PaginationItem>
				))}

				{page < totalPages && (
					<PaginationItem>
						<PaginationNext href={buildUrl(page + 1)} />
					</PaginationItem>
				)}
			</PaginationContent>
		</Pagination>
	);
}
