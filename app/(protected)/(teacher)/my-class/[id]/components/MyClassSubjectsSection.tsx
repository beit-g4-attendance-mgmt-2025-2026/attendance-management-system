import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { MyClassSubjectItem } from "@/lib/actions/GetMyClass.actions";
import QueryPagination from "./QueryPagination";

type Props = {
	subjects: MyClassSubjectItem[];
	page: number;
	pageSize: number;
	total: number;
};

const MyClassSubjectsSection = ({
	subjects,
	page,
	pageSize,
	total,
}: Props) => {
	return (
		<section className="space-y-3">
			<h2 className="text-lg font-semibold">Subjects</h2>

			{subjects.length === 0 ? (
				<div className="flex items-center justify-center min-h-[18vh] border rounded-xl">
					<p className="text-gray-500">No subjects found.</p>
				</div>
			) : (
				<>
					<div className="max-h-[420px] overflow-auto rounded-xl border">
						<Table>
							<TableHeader className="sticky top-0 z-10 bg-background">
								<TableRow>
									<TableHead>No</TableHead>
									<TableHead>Code</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Teacher</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{subjects.map((subject, index) => (
									<TableRow
										key={subject.id}
										className={`cursor-pointer transition-colors border-none  ${
											index % 2 === 0
												? ""
												: "bg-gray-200 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 "
										}`}
									>
										<TableCell>{index + 1}</TableCell>
										<TableCell>{subject.subCode}</TableCell>
										<TableCell>{subject.name}</TableCell>
										<TableCell>{subject.teacherName}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					<QueryPagination
						page={page}
						pageSize={pageSize}
						total={total}
						pageParam="subjectsPage"
						pageSizeParam="subjectsPageSize"
					/>
				</>
			)}
		</section>
	);
};

export default MyClassSubjectsSection;
