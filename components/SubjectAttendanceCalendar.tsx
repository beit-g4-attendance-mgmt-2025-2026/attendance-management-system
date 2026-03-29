import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GetSubjectMonthlyReport } from "@/lib/actions/GetSubjectMonthlyReport.actions";

type SubjectMonthlyReportData = NonNullable<
	Awaited<ReturnType<typeof GetSubjectMonthlyReport>>["data"]
>;

const monthLabels: Record<SubjectMonthlyReportData["month"], string> = {
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

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonthIndex(month: SubjectMonthlyReportData["month"]) {
	return Object.keys(monthLabels).indexOf(month);
}

function formatDate(year: number, monthIndex: number, day: number) {
	return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function SubjectAttendanceCalendar({
	data,
}: {
	data: SubjectMonthlyReportData;
}) {
	const year = new Date().getFullYear();
	const monthIndex = getMonthIndex(data.month);
	const firstDay = new Date(year, monthIndex, 1).getDay();
	const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
	const takenDaySet = new Set(data.takenDays);
	const cells = [
		...Array.from({ length: firstDay }, (_, index) => ({
			key: `empty-${index}`,
			day: null as number | null,
		})),
		...Array.from({ length: daysInMonth }, (_, index) => ({
			key: `day-${index + 1}`,
			day: index + 1,
		})),
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>{monthLabels[data.month]} Attendance Calendar</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex flex-wrap gap-4 text-sm">
					<div className="flex items-center gap-2">
						<span className="size-3 rounded-full bg-emerald-500" />
						Taken
					</div>
					<div className="flex items-center gap-2">
						<span className="size-3 rounded-full bg-slate-300" />
						Not Taken
					</div>
				</div>

				<div className="grid grid-cols-7 gap-2 text-center text-sm">
					{weekdayLabels.map((label) => (
						<div
							key={label}
							className="text-muted-foreground py-2 font-medium"
						>
							{label}
						</div>
					))}

					{cells.map((cell) =>
						cell.day ? (
							<Link
								key={cell.key}
								href={`/my-subjects/${data.subjectId}?date=${formatDate(year, monthIndex, cell.day)}`}
								className={cn(
									"flex min-h-20 flex-col rounded-xl border p-3 text-left transition-colors hover:border-sky-400 hover:bg-sky-50",
									takenDaySet.has(cell.day)
										? "border-emerald-200 bg-emerald-50"
										: "border-slate-200 bg-slate-50",
								)}
							>
								<span className="text-sm font-semibold">{cell.day}</span>
								<span
									className={cn(
										"mt-2 text-xs font-medium",
										takenDaySet.has(cell.day)
											? "text-emerald-700"
											: "text-slate-500",
									)}
								>
									{takenDaySet.has(cell.day) ? "Attendance taken" : "No attendance"}
								</span>
							</Link>
						) : (
							<div
								key={cell.key}
								className="min-h-20 rounded-xl border border-transparent"
							/>
						),
					)}
				</div>
			</CardContent>
		</Card>
	);
}
