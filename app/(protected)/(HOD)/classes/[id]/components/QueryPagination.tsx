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

type Props = {
	page: number;
	pageSize: number;
	total: number;
	pageParam: string;
	pageSizeParam: string;
};

const QueryPagination = ({
	page,
	pageSize,
	total,
	pageParam,
	pageSizeParam,
}: Props) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentQuery = queryString.parse(searchParams.toString());

	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	if (totalPages <= 1) return null;

	const buildUrl = (nextPage: number) =>
		queryString.stringifyUrl(
			{
				url: pathname,
				query: {
					...currentQuery,
					[pageParam]: nextPage,
					[pageSizeParam]: pageSize,
				},
			},
			{ skipNull: true, skipEmptyString: true },
		);

	let start = Math.max(1, page - 1);
	const end = Math.min(totalPages, start + 2);
	start = Math.max(1, end - 2);

	const pages: number[] = [];
	for (let p = start; p <= end; p++) {
		pages.push(p);
	}

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
						<PaginationLink href={buildUrl(p)} isActive={p === page}>
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
};

export default QueryPagination;
