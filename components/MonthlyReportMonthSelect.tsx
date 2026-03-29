"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

const monthValues = [
	"JANUARY",
	"FEBRUARY",
	"MARCH",
	"APRIL",
	"MAY",
	"JUNE",
	"JULY",
	"AUGUST",
	"SEPTEMBER",
	"OCTOBER",
	"NOVEMBER",
	"DECEMBER",
] as const;

type MonthValue = (typeof monthValues)[number];

const monthLabels: Record<MonthValue, string> = {
	JANUARY: "January",
	FEBRUARY: "February",
	MARCH: "March",
	APRIL: "April",
	MAY: "May",
	JUNE: "June",
	JULY: "July",
	AUGUST: "August",
	SEPTEMBER: "September",
	OCTOBER: "October",
	NOVEMBER: "November",
	DECEMBER: "December",
};

type Props = {
	value: MonthValue;
};

export default function MonthlyReportMonthSelect({ value }: Props) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	return (
		<div className="flex items-center gap-2">
			<span className="text-sm font-medium text-slate-600">Month</span>
			<Select
				value={value}
				onValueChange={(nextMonth) => {
					const currentQuery = queryString.parse(searchParams.toString());
					const url = queryString.stringifyUrl(
						{
							url: pathname,
							query: {
								...currentQuery,
								month: nextMonth,
							},
						},
						{ skipEmptyString: true, skipNull: true },
					);

					router.push(url);
				}}
			>
				<SelectTrigger className="min-w-[170px] border-sky-200 bg-white text-slate-900">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{monthValues.map((month) => (
						<SelectItem key={month} value={month}>
							{monthLabels[month]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
