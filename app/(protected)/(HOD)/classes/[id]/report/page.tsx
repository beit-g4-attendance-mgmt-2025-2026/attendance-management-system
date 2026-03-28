import BackBtn from "@/components/BackBtn";
import { ExportCsvBtn } from "@/components/ExportCsvBtn";
import MonthlyClassReportTable from "@/components/MonthlyClassReportTable";
import MonthlyReportMonthSelect from "@/components/MonthlyReportMonthSelect";
import { Month } from "@/generated/prisma/client";
import { GetClassById } from "@/lib/actions/GetClassById";
import { GetMonthlyClassReport } from "@/lib/actions/GetMonthlyClassReport.actions";

const monthValues = Object.values(Month);

function getSelectedMonth(rawMonth?: string) {
	if (rawMonth && monthValues.includes(rawMonth as Month)) {
		return rawMonth as Month;
	}

	return monthValues[new Date().getMonth()];
}

const page = async ({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
	const { id } = await params;
	const query = await searchParams;

	const classDetails = await GetClassById(id);

	if (!classDetails.success || !classDetails.data) {
		return (
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<BackBtn />
					<h1 className="text-xl font-semibold">Monthly Report</h1>
				</div>
				<div className="flex min-h-[40vh] items-center justify-center">
					<p className="text-gray-500">
						{classDetails.message ?? "Class not found."}
					</p>
				</div>
			</div>
		);
	}

	const selectedMonth = getSelectedMonth(
		typeof query.month === "string" ? query.month : undefined,
	);

	const report = await GetMonthlyClassReport({
		classId: id,
		month: selectedMonth,
	});

	return (
		<div className="space-y-6">
			<nav className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="flex items-center gap-3">
					<BackBtn />
					<div>
						<h1 className="text-xl font-semibold text-slate-900">
							{classDetails.data.classInfo.name}
						</h1>
						<p className="text-sm text-slate-500">Monthly class report</p>
					</div>
				</div>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<MonthlyReportMonthSelect value={selectedMonth} />
					<ExportCsvBtn
						endpoint={`/api/monthly-class-report/${id}/export`}
						allowedParams={["month"]}
						className="rounded-md px-0 font-medium text-sky-700"
					/>
				</div>
			</nav>

			{report.success && report.data ? (
				<MonthlyClassReportTable data={report.data} />
			) : (
				<div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
					{report.message ?? "Unable to load the monthly report."}
				</div>
			)}
		</div>
	);
};

export default page;
