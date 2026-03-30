import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { MonthlyClassReportData } from "@/lib/actions/GetMonthlyClassReport.actions";
import { cn } from "@/lib/utils";

type Props = {
	data: MonthlyClassReportData;
	className?: string;
};

const NO_WIDTH = "40px";
const ROLL_NO_WIDTH = "80px";
const NAME_WIDTH = "150px";
const SUBJECT_WIDTH = "60px";
const OVERALL_WIDTH = "72px";

function statusLabel(status: "good" | "risk" | "empty") {
	if (status === "good") return "Good";
	if (status === "risk") return "Risk";
	return "Empty";
}

function statusClasses(status: "good" | "risk" | "empty") {
	if (status === "good") {
		return "border-emerald-200 bg-emerald-50 text-emerald-700";
	}

	if (status === "risk") {
		return "border-rose-200 bg-rose-50 text-rose-700";
	}

	return "border-slate-200 bg-slate-50 text-slate-500";
}

export default function MonthlyClassReportTable({ data, className }: Props) {
	return (
		<div className={cn("space-y-3", className)}>
			<div className="grid grid-cols-4 gap-2">
				<Card className="border-slate-200 shadow-none">
					<CardContent className="px-3 py-2">
						<p className="text-[11px] text-slate-500">Students</p>
						<p className="text-lg font-semibold leading-none text-slate-900">
							{data.summary.studentCount}
						</p>
					</CardContent>
				</Card>
				<Card className="border-slate-200 shadow-none">
					<CardContent className="px-3 py-2">
						<p className="text-[11px] text-slate-500">Subjects</p>
						<p className="text-lg font-semibold leading-none text-slate-900">
							{data.summary.subjectCount}
						</p>
					</CardContent>
				</Card>
				<Card className="border-rose-100 bg-rose-50/60 shadow-none">
					<CardContent className="px-3 py-2">
						<p className="text-[11px] text-rose-600">Below 75%</p>
						<p className="text-lg font-semibold leading-none text-rose-700">
							{data.summary.atRiskCount}
						</p>
					</CardContent>
				</Card>
				<Card className="border-sky-100 bg-sky-50/70 shadow-none">
					<CardContent className="px-3 py-2">
						<p className="text-[11px] text-sky-700">Class Overall</p>
						<p className="text-lg font-semibold leading-none text-sky-800">
							{data.summary.overallPercentage.toFixed(1)}%
						</p>
					</CardContent>
				</Card>
			</div>

			<Card className="overflow-hidden border-slate-200 shadow-none">
				<CardHeader className="gap-1 border-b bg-slate-50/80 px-4 py-3">
					<CardTitle className="text-sm text-slate-900">
						Monthly Attendance Report
					</CardTitle>
					<CardDescription className="text-[11px] text-slate-600">
						{data.className} | {data.month} | {data.summary.noDataCount} no-data
						students
					</CardDescription>
				</CardHeader>

				<CardContent className="p-0">
					<Table className="w-full table-fixed border-separate border-spacing-0 text-xs">
						<TableHeader>
							<TableRow className="h-[160px] hover:bg-transparent">
								<TableHead
									className="border-b border-r bg-white px-1 text-center align-middle font-semibold text-slate-700"
									style={{ width: NO_WIDTH, minWidth: NO_WIDTH, maxWidth: NO_WIDTH }}
								>
									No
								</TableHead>
								<TableHead
									className="border-b border-r bg-white px-1 text-center align-middle font-semibold text-slate-700"
									style={{
										width: ROLL_NO_WIDTH,
										minWidth: ROLL_NO_WIDTH,
										maxWidth: ROLL_NO_WIDTH,
									}}
								>
									Roll No
								</TableHead>
								<TableHead
									className="border-b border-r bg-white px-2 text-left align-middle font-semibold text-slate-700"
									style={{ width: NAME_WIDTH, minWidth: NAME_WIDTH, maxWidth: NAME_WIDTH }}
								>
									Student Name
								</TableHead>
								{data.columns.map((column) => (
									<TableHead
										key={column.subjectId}
										className="h-[160px] border-b border-r bg-slate-50 p-1 align-bottom text-center"
										style={{
											width: SUBJECT_WIDTH,
											minWidth: SUBJECT_WIDTH,
											maxWidth: SUBJECT_WIDTH,
										}}
									>
										<div className="flex h-full items-end justify-center">
											<div
												className="flex items-center justify-center text-[11px] font-semibold text-slate-700 [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180"
												title={`${column.subjectCode} - ${column.subjectName}`}
											>
												<span className="tracking-wide">{column.subjectCode}</span>
												<span className="mt-1 text-[10px] font-normal text-slate-500">
													{column.subjectName}
												</span>
											</div>
										</div>
									</TableHead>
								))}
								<TableHead
									className="h-[160px] border-b bg-sky-50 p-1 text-center align-bottom"
									style={{
										width: OVERALL_WIDTH,
										minWidth: OVERALL_WIDTH,
										maxWidth: OVERALL_WIDTH,
									}}
								>
									<div className="flex h-full items-end justify-center">
										<div className="text-[11px] font-semibold text-sky-900 [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180">
											Overall
										</div>
									</div>
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{data.rows.length === 0 ? (
								<TableRow className="hover:bg-transparent">
									<TableCell
										colSpan={data.columns.length + 4}
										className="h-24 text-center text-xs text-slate-500"
									>
										No daily attendance data found for this month.
									</TableCell>
								</TableRow>
							) : (
								data.rows.map((row, index) => (
									<TableRow
										key={row.studentId}
										className={cn(
											"text-[11px] hover:bg-slate-50/70",
											row.status === "risk" && "bg-rose-50/40 hover:bg-rose-50/60",
										)}
									>
										<TableCell
											className="border-r px-1 py-2 text-center"
											style={{ width: NO_WIDTH, maxWidth: NO_WIDTH }}
										>
											{index + 1}
										</TableCell>
										<TableCell
											className="border-r px-1 py-2 text-center font-medium"
											style={{ width: ROLL_NO_WIDTH, maxWidth: ROLL_NO_WIDTH }}
										>
											{row.rollNo}
										</TableCell>
										<TableCell
											className="border-r px-2 py-2 font-medium text-slate-900"
											style={{ width: NAME_WIDTH, maxWidth: NAME_WIDTH }}
										>
											<div className="truncate">{row.studentName}</div>
										</TableCell>

										{data.columns.map((column) => {
											const cell = row.subjects[column.subjectId];

											return (
												<TableCell
													key={`${row.studentId}-${column.subjectId}`}
													className="border-r px-1 py-2 text-center"
													style={{
														width: SUBJECT_WIDTH,
														maxWidth: SUBJECT_WIDTH,
													}}
												>
													<div className="flex flex-col items-center justify-center gap-1">
														<div className="text-[11px] font-semibold leading-none text-slate-900">
															{cell.totalTimes > 0
																? `${cell.percentage.toFixed(0)}%`
																: "-"}
														</div>
														<div
															className={cn(
																"inline-flex min-w-[44px] justify-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium leading-none",
																statusClasses(cell.status),
															)}
														>
															{statusLabel(cell.status)}
														</div>
													</div>
												</TableCell>
											);
										})}

										<TableCell
											className="bg-sky-50/60 px-1 py-2 text-center"
											style={{ width: OVERALL_WIDTH, maxWidth: OVERALL_WIDTH }}
										>
											<div className="flex flex-col items-center justify-center gap-1">
												<div className="text-[11px] font-semibold leading-none text-sky-900">
													{row.totalTimes > 0 ? `${row.percentage.toFixed(0)}%` : "-"}
												</div>
												<div
													className={cn(
														"inline-flex min-w-[44px] justify-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium leading-none",
														statusClasses(row.status),
													)}
												>
													{statusLabel(row.status)}
												</div>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
