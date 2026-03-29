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
import type {
  MonthlyClassReportColumn,
  MonthlyClassReportRow,
} from "@/lib/actions/GetMonthlyClassReport.actions";
import { cn } from "@/lib/utils";

type MonthlyClassReportTableData = {
	classId: string;
	className: string;
	month: string;
	columns: MonthlyClassReportColumn[];
	rows: MonthlyClassReportRow[];
};

type Props = {
  data: MonthlyClassReportTableData;
  className?: string;
};

const ROLL_NO_STICKY_LEFT = "0rem";
const NAME_STICKY_LEFT = "7.5rem";

function getPercentage(times: number, totalTimes: number) {
  if (totalTimes <= 0) return 0;
  return (times / totalTimes) * 100;
}

function formatPercentage(times: number, totalTimes: number) {
  return `${getPercentage(times, totalTimes).toFixed(1)}%`;
}

export default function MonthlyClassReportTable({ data, className }: Props) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-sky-100 shadow-sm shadow-sky-100/60",
        className,
      )}
    >
      <CardHeader className="border-b border-sky-100 bg-linear-to-r from-sky-50 via-white to-blue-50">
        <CardTitle className="text-slate-900">
          Monthly Attendance Report
        </CardTitle>
        <CardDescription className="text-slate-600">
          {data.className} • {data.rows.length} students • {data.columns.length}{" "}
          subjects
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <div className="px-6 pb-4 pt-4 text-sm text-slate-600">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
						<span>
							<span className="font-medium text-slate-900">Month:</span>{" "}
							{data.month}
						</span>
						<span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
							Below 75% highlighted
						</span>
          </div>
        </div>

        <Table className="min-w-[900px] border-separate border-spacing-0">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead
                className="sticky top-0 z-30 min-w-[120px] border-b border-r border-sky-100 bg-sky-100 text-slate-900 shadow-[1px_0_0_0] shadow-sky-100"
                style={{ left: ROLL_NO_STICKY_LEFT }}
              >
                Roll No
              </TableHead>
              <TableHead
                className="sticky top-0 z-30 min-w-[220px] border-b border-r border-sky-100 bg-sky-50 text-slate-900 shadow-[1px_0_0_0] shadow-sky-100"
                style={{ left: NAME_STICKY_LEFT }}
              >
                Name
              </TableHead>
              {data.columns.map((column) => (
                <TableHead
                  key={column.subjectId}
                  className="top-0 z-20 min-w-[140px] border-b border-r border-sky-100 bg-linear-to-b from-sky-50 to-white text-center text-slate-900"
                >
                  <div className="font-semibold">{column.subjectCode}</div>
                  <div className="text-xs font-normal text-slate-500">
                    {column.subjectName}
                  </div>
                </TableHead>
              ))}
              <TableHead className="top-0 z-20 min-w-[140px] border-b border-sky-100 bg-linear-to-b from-sky-100 to-sky-50 text-center text-slate-900">
                Overall
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={data.columns.length + 3}
                  className="h-28 text-center text-sm text-slate-500"
                >
                  No monthly attendance data found for this class and month.
                </TableCell>
              </TableRow>
            ) : (
              data.rows.map((row) => {
                const rowIsAtRisk = !row.status;
                const overallTotals = Object.values(row.subjects).reduce(
                  (acc, cell) => ({
                    times: acc.times + cell.times,
                    totalTimes: acc.totalTimes + cell.totalTimes,
                  }),
                  { times: 0, totalTimes: 0 },
                );
                const overallPercentage = formatPercentage(
                  overallTotals.times,
                  overallTotals.totalTimes,
                );

                return (
                  <TableRow
                    key={row.studentId}
                    className={cn(
                      "border-b border-sky-50",
                      rowIsAtRisk
                        ? "bg-red-50/50 hover:bg-red-50/70"
                        : "hover:bg-sky-50/50",
                    )}
                  >
                    <TableCell
                      className={cn(
                        "sticky z-20 min-w-[120px] border-r border-sky-100 font-medium shadow-[1px_0_0_0] shadow-sky-100",
                        rowIsAtRisk ? "bg-red-50" : "bg-white",
                      )}
                      style={{ left: ROLL_NO_STICKY_LEFT }}
                    >
                      {row.rollNo}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "sticky z-20 min-w-[220px] border-r border-sky-100 font-medium text-slate-900 shadow-[1px_0_0_0] shadow-sky-100",
                        rowIsAtRisk ? "bg-red-50" : "bg-sky-50/60",
                      )}
                      style={{ left: NAME_STICKY_LEFT }}
                    >
                      <div className="truncate">{row.studentName}</div>
                    </TableCell>

                    {data.columns.map((column) => {
                      const cell = row.subjects[column.subjectId];
                      const cellIsAtRisk = !cell.status;

                      return (
                        <TableCell
                          key={`${row.studentId}-${column.subjectId}`}
                          className={cn(
                            "min-w-[140px] border-r border-sky-50 text-center align-middle",
                            cellIsAtRisk && "bg-red-50 text-red-700",
                          )}
                        >
                          <div className="font-semibold">
                            {formatPercentage(cell.times, cell.totalTimes)}
                          </div>
                          <div
                            className={cn(
                              "text-xs",
                              cellIsAtRisk ? "text-red-600" : "text-slate-500",
                            )}
                          >
                            {cell.times}/{cell.totalTimes}
                          </div>
                        </TableCell>
                      );
                    })}

                    <TableCell
                      className={cn(
                        "min-w-[140px] text-center font-semibold",
                        rowIsAtRisk
                          ? "bg-red-100 text-red-700"
                          : "bg-sky-50 text-sky-700",
                      )}
                    >
                      <div>{overallPercentage}</div>
                      <div className="text-xs font-medium">
                        {row.status ? "Good standing" : "Below 75%"}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
