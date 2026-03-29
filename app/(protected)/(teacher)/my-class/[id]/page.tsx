import BackBtn from "@/components/BackBtn";
import { ExportCsvBtn } from "@/components/ExportCsvBtn";
import { GetMyClassDetails } from "@/lib/actions/GetMyClassDetails.actions";
import MyClassStudentsSection from "./components/MyClassStudentsSection";
import MyClassSubjectsSection from "./components/MyClassSubjectsSection";
import MyClassSummaryCard from "./components/MyClassSummaryCard";

const page = async ({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ [key: string]: string }>;
}) => {
	const { id } = await params;
	const query = await searchParams;

	const studentsPage = Number(query.studentsPage) || 1;
	const studentsPageSize = Number(query.studentsPageSize) || 10;
	const subjectsPage = Number(query.subjectsPage) || 1;
	const subjectsPageSize = Number(query.subjectsPageSize) || 10;
	const studentsSearch = query.studentsSearch || "";
	const subjectsSearch = query.subjectsSearch || "";

	const { success, data, message } = await GetMyClassDetails({
		classId: id,
		studentsPage,
		studentsPageSize,
		subjectsPage,
		subjectsPageSize,
		studentsSearch,
		subjectsSearch,
	});

	if (!success || !data) {
		return (
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<BackBtn />
					<h1 className="text-xl font-semibold">My Class</h1>
				</div>
				<div className="flex items-center justify-center min-h-[40vh]">
					<p className="text-gray-500">
						{message ?? "Class not found."}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<nav className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<BackBtn />
					<h1 className="text-xl font-semibold">{data.myClass.name}</h1>
				</div>
				<ExportCsvBtn endpoint={`/api/my-class/${id}/export`} label="Export CSV" />
			</nav>

			<MyClassSummaryCard classInfo={data.myClass} />

			<MyClassSubjectsSection
				subjects={data.subjects}
				page={subjectsPage}
				pageSize={subjectsPageSize}
				total={data.subjectsTotal}
			/>

			<MyClassStudentsSection
				students={data.students}
				page={studentsPage}
				pageSize={studentsPageSize}
				total={data.studentsTotal}
			/>
		</div>
	);
};

export default page;
