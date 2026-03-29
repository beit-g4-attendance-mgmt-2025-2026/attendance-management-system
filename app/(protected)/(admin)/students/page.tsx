import { Paginationn } from "@/components/Pagination";
import StudentsListTable from "./components/StudentListTable";
import SubHeader from "@/components/sub-header";
import { DialogCardBtn } from "@/components/DialogCardBtn";
import StudentForm from "./components/StudentForm";
import { GetStudents } from "@/lib/actions/GetStudents";
import { Years, semesters } from "@/constants/index.constants";
import { GetCurrentUserRole } from "@/lib/actions/GetCurrentUserRole.actions";

const page = async ({
	searchParams,
}: {
	searchParams: Promise<{
		[key: string]: string; //don't need to specify exact keys
	}>;
}) => {
	const { page, pageSize, search, filter, year, semester } =
		await searchParams;
	const currentUser = await GetCurrentUserRole();
	const showDepartmentFilter = currentUser.data?.role !== "HOD";

	const { data } = await GetStudents({
		page: Number(page) || 1,
		pageSize: Number(pageSize) || 10,
		search: search || "",
		filter,
		year,
		semester,
	});

	const total = data?.total ?? 0;

	const { students = [] } = data || {};

	return (
		<>
			<SubHeader
				placeholder="Search student by name or email"
				exportEndpoint="/api/students/export"
				showDepartmentFilter={showDepartmentFilter}
				filters={[
					{
						label: "Year",
						queryKey: "year",
						options: Years,
					},
					{
						label: "Semester",
						queryKey: "semester",
						options: semesters,
					},
				]}
				dialogButton={
					<DialogCardBtn
						triggerName="Add Student"
						title="Add Student"
						description="Enter student details"
					>
						<StudentForm isEdit={false} />
					</DialogCardBtn>
				}
			/>
			{students?.length ? (
				<main className="space-y-5">
					<div className=" flex items-center justify-center max-w-5xl mx-auto">
						<StudentsListTable students={students} />
					</div>
					<Paginationn
						page={Number(page) || 1}
						pageSize={Number(pageSize) || 10}
						total={total}
					/>
				</main>
			) : (
				<div className="flex items-center justify-center min-h-[50vh]">
					<p className="text-gray-500">No students found.</p>
				</div>
			)}
		</>
	);
};

export default page;
