"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { GetSubjectMonthlyReport } from "@/lib/actions/GetSubjectMonthlyReport.actions";

type SubjectMonthlyReportData = NonNullable<
	Awaited<ReturnType<typeof GetSubjectMonthlyReport>>["data"]
>;

export default function SubjectMonthlyReportTable({
	data,
}: {
	data: SubjectMonthlyReportData;
}) {
	return (
		<div className="space-y-4">
			<div className="grid gap-4 md:grid-cols-3">
				<div className="rounded-xl border bg-card p-4">
					<p className="text-sm text-muted-foreground">Monthly Present Total</p>
					<p className="text-2xl font-semibold">{data.totalPresentTimes}</p>
				</div>
				<div className="rounded-xl border bg-card p-4">
					<p className="text-sm text-muted-foreground">Monthly Total Times</p>
					<p className="text-2xl font-semibold">{data.totalPossibleTimes}</p>
				</div>
				<div className="rounded-xl border bg-card p-4">
					<p className="text-sm text-muted-foreground">Overall Attendance</p>
					<p className="text-2xl font-semibold">
						{data.overallPercentage.toFixed(1)}%
					</p>
				</div>
			</div>

			<div className="rounded-xl border bg-card">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-16">No</TableHead>
							<TableHead className="w-[150px]">Roll No</TableHead>
							<TableHead>Name</TableHead>
							<TableHead className="text-right">Present</TableHead>
							<TableHead className="text-right">Total</TableHead>
							<TableHead className="text-right">Percentage</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.rows.map((row, index) => (
							<TableRow key={row.studentId}>
								<TableCell>{index + 1}</TableCell>
								<TableCell className="font-medium">{row.rollNo}</TableCell>
								<TableCell>{row.name}</TableCell>
								<TableCell className="text-right">{row.presentTimes}</TableCell>
								<TableCell className="text-right">{row.totalTimes}</TableCell>
								<TableCell className="text-right">
									{row.percentage.toFixed(1)}%
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
