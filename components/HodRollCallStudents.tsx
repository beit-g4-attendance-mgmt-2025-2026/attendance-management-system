"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type RollCallStudent = {
	id: string;
	rollNo: string;
	name: string;
	year: string;
	semester: string;
	rollCallPercent: number;
	class: {
		name: string;
	} | null;
};

const toYearLabel = (year: string) =>
	year
		.toLowerCase()
		.replaceAll("_", " ")
		.replace(/\b\w/g, (char) => char.toUpperCase());

const toSemesterLabel = (semester: string) =>
	semester === "first_semester" ? "1st Semester" : "2nd Semester";

const HodRollCallStudents = ({
	students,
}: {
	students: RollCallStudent[];
}) => {
	return (
		<div className="bg-white p-4 rounded-xl shadow-sm h-full dark:bg-[#1E293B]">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold">
					Students Under 75% Roll Call
				</h2>
				<span className="text-xs text-white font-medium px-2 py-1 bg-red-500 rounded-full">
					At Risk ({students.length})
				</span>
			</div>

			<div className="max-h-[420px] overflow-y-auto rounded-md border">
				<Table>
					<TableHeader className="sticky top-0 bg-white dark:bg-[#1E293B] z-10">
						<TableRow>
							<TableHead>Roll No</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Year</TableHead>
							<TableHead>Semester</TableHead>
							<TableHead>Class</TableHead>
							<TableHead className="text-right">
								Roll Call %
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{students.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center text-muted-foreground py-8"
								>
									No students under 75% roll call.
								</TableCell>
							</TableRow>
						) : (
							students.map((student, index) => (
								<TableRow
									key={student.id}
									className={
										index % 2 === 0
											? ""
											: "bg-blue-50 dark:bg-gray-800"
									}
								>
									<TableCell className="font-medium">
										{student.rollNo}
									</TableCell>
									<TableCell>{student.name}</TableCell>
									<TableCell>{toYearLabel(student.year)}</TableCell>
									<TableCell>
										{toSemesterLabel(student.semester)}
									</TableCell>
									<TableCell>
										{student.class?.name ?? "-"}
									</TableCell>
									<TableCell className="text-right font-semibold text-sky-600">
										{student.rollCallPercent}%
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default HodRollCallStudents;
