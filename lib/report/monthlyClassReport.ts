import { Month } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type MonthlyClassReportColumn = {
	subjectId: string;
	subjectName: string;
	subjectCode: string;
};

export type MonthlyClassReportCellStatus = "good" | "risk" | "empty";

export type MonthlyClassReportSubjectCell = {
	subjectId: string;
	subjectName: string;
	subjectCode: string;
	times: number;
	totalTimes: number;
	percentage: number;
	status: MonthlyClassReportCellStatus;
};

export type MonthlyClassReportRow = {
	studentId: string;
	studentName: string;
	rollNo: string;
	presentTimes: number;
	totalTimes: number;
	percentage: number;
	status: MonthlyClassReportCellStatus;
	subjects: Record<string, MonthlyClassReportSubjectCell>;
};

export type MonthlyClassReportData = {
	classId: string;
	className: string;
	month: Month;
	columns: MonthlyClassReportColumn[];
	rows: MonthlyClassReportRow[];
	summary: {
		studentCount: number;
		subjectCount: number;
		atRiskCount: number;
		noDataCount: number;
		overallPercentage: number;
	};
};

type BuildMonthlyClassReportInput = {
	classId: string;
	className: string;
	month: Month;
	subjects: Array<{
		id: string;
		name: string;
		subCode: string;
	}>;
	students: Array<{
		id: string;
		name: string;
		rollNo: string;
	}>;
};

function getPercentage(times: number, totalTimes: number) {
	if (totalTimes <= 0) return 0;
	return Number(((times / totalTimes) * 100).toFixed(1));
}

function getStatus(times: number, totalTimes: number): MonthlyClassReportCellStatus {
	if (totalTimes <= 0) return "empty";
	return times / totalTimes >= 0.75 ? "good" : "risk";
}

export async function buildMonthlyClassReportData(
	input: BuildMonthlyClassReportInput,
): Promise<MonthlyClassReportData> {
	const columns: MonthlyClassReportColumn[] = input.subjects.map((subject) => ({
		subjectId: subject.id,
		subjectName: subject.name,
		subjectCode: subject.subCode,
	}));

	const subjectIds = input.subjects.map((subject) => subject.id);
	const studentIds = input.students.map((student) => student.id);

	const attendance =
		subjectIds.length === 0 || studentIds.length === 0
			? []
			: await prisma.dailyAttendance.findMany({
					where: {
						month: input.month,
						subjectId: { in: subjectIds },
						studentId: { in: studentIds },
					},
					select: {
						studentId: true,
						subjectId: true,
						times: true,
						totalTimes: true,
					},
				});

	const totalsByStudentAndSubject = new Map<
		string,
		{ times: number; totalTimes: number }
	>();

	for (const item of attendance) {
		const key = `${item.studentId}:${item.subjectId}`;
		const current = totalsByStudentAndSubject.get(key) ?? {
			times: 0,
			totalTimes: 0,
		};

		current.times += item.times;
		current.totalTimes += item.totalTimes;
		totalsByStudentAndSubject.set(key, current);
	}

	const rows: MonthlyClassReportRow[] = [...input.students]
		.sort(
			(left, right) =>
				left.rollNo.localeCompare(right.rollNo, undefined, {
					numeric: true,
					sensitivity: "base",
				}) || left.name.localeCompare(right.name),
		)
		.map((student) => {
			const subjectCells = Object.fromEntries(
				columns.map((column) => {
					const totals =
						totalsByStudentAndSubject.get(`${student.id}:${column.subjectId}`) ?? {
							times: 0,
							totalTimes: 0,
						};
					const percentage = getPercentage(totals.times, totals.totalTimes);

					return [
						column.subjectId,
						{
							subjectId: column.subjectId,
							subjectName: column.subjectName,
							subjectCode: column.subjectCode,
							times: totals.times,
							totalTimes: totals.totalTimes,
							percentage,
							status: getStatus(totals.times, totals.totalTimes),
						},
					];
				}),
			) as Record<string, MonthlyClassReportSubjectCell>;

			const overallTotals = Object.values(subjectCells).reduce(
				(acc, cell) => ({
					times: acc.times + cell.times,
					totalTimes: acc.totalTimes + cell.totalTimes,
				}),
				{ times: 0, totalTimes: 0 },
			);

			return {
				studentId: student.id,
				studentName: student.name,
				rollNo: student.rollNo,
				presentTimes: overallTotals.times,
				totalTimes: overallTotals.totalTimes,
				percentage: getPercentage(overallTotals.times, overallTotals.totalTimes),
				status: getStatus(overallTotals.times, overallTotals.totalTimes),
				subjects: subjectCells,
			};
		});

	const atRiskCount = rows.filter((row) => row.status === "risk").length;
	const noDataCount = rows.filter((row) => row.status === "empty").length;
	const totals = rows.reduce(
		(acc, row) => ({
			times: acc.times + row.presentTimes,
			totalTimes: acc.totalTimes + row.totalTimes,
		}),
		{ times: 0, totalTimes: 0 },
	);

	return {
		classId: input.classId,
		className: input.className,
		month: input.month,
		columns,
		rows,
		summary: {
			studentCount: rows.length,
			subjectCount: columns.length,
			atRiskCount,
			noDataCount,
			overallPercentage: getPercentage(totals.times, totals.totalTimes),
		},
	};
}
