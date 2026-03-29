import BackBtn from "@/components/BackBtn";
import SubjectAttendanceCalendar from "@/components/SubjectAttendanceCalendar";
import MonthlyReportMonthSelect from "@/components/MonthlyReportMonthSelect";
import SubjectMonthlyReportTable from "@/components/SubjectMonthlyReportTable";
import { Month } from "@/generated/prisma/enums";
import { GetSubjectMonthlyReport } from "@/lib/actions/GetSubjectMonthlyReport.actions";

const monthValues = Object.values(Month);

function resolveMonth(rawMonth?: string) {
	if (rawMonth && monthValues.includes(rawMonth as Month)) {
		return rawMonth as Month;
	}

	return monthValues[new Date().getMonth()];
}

const Page = async ({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ month?: string }>;
}) => {
	const { id } = await params;
	const query = await searchParams;
	const selectedMonth = resolveMonth(query.month);
	const report = await GetSubjectMonthlyReport({
		subjectId: id,
		month: selectedMonth,
	});

	if (!report.success || !report.data) {
		return (
			<div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
				{report.message ?? "Unable to load the subject report."}
			</div>
		);
	}

	return (
		<main className="space-y-6">
			<nav className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<BackBtn />
					<div>
						<h1 className="text-xl font-semibold">
							{report.data.subjectName}
						</h1>
						<p className="text-sm text-muted-foreground">
							{report.data.subjectCode} - {report.data.className}
						</p>
					</div>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<MonthlyReportMonthSelect value={selectedMonth} />
				</div>
			</nav>

			<SubjectAttendanceCalendar data={report.data} />
			<SubjectMonthlyReportTable data={report.data} />
		</main>
	);
};

export default Page;
