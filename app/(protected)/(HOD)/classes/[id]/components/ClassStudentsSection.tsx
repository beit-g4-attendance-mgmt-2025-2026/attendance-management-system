import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { MyClassStudentItem } from "@/lib/actions/GetMyClass.actions";
import QueryPagination from "./QueryPagination";

type Props = {
	students: MyClassStudentItem[];
	page: number;
	pageSize: number;
	total: number;
};

const ClassStudentsSection = ({
	students,
	page,
	pageSize,
	total,
}: Props) => {
	return (
		<section className="space-y-3">
			<h2 className="text-lg font-semibold">Students</h2>

			{students.length === 0 ? (
				<div className="flex items-center justify-center min-h-[18vh] border rounded-xl">
					<p className="text-gray-500">No students found.</p>
				</div>
			) : (
				<>
					<Table className="border rounded-xl">
						<TableHeader>
							<TableRow>
								<TableHead>No</TableHead>
								<TableHead>Roll No</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Gender</TableHead>
								<TableHead>Year</TableHead>
								<TableHead>Semester</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Phone</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{students.map((student, index) => (
								<TableRow
									key={student.id}
									className={`cursor-pointer transition-colors border-none ${
										index % 2 === 0
											? ""
											: "bg-gray-200 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800"
									}`}
								>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{student.rollNo}</TableCell>
									<TableCell>{student.name}</TableCell>
									<TableCell>{student.gender}</TableCell>
									<TableCell>{student.year}</TableCell>
									<TableCell>{student.semester}</TableCell>
									<TableCell>{student.email}</TableCell>
									<TableCell>{student.phoneNumber}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					<QueryPagination
						page={page}
						pageSize={pageSize}
						total={total}
						pageParam="studentsPage"
						pageSizeParam="studentsPageSize"
					/>
				</>
			)}
		</section>
	);
};

export default ClassStudentsSection;
