import BackBtn from "@/components/BackBtn";
import { DialogCardBtn } from "@/components/DialogCardBtn";
import ClassForm from "@/components/ClassForm";
import { GetClassById } from "@/lib/actions/GetClassById";
import ClassStudentsSection from "./components/ClassStudentsSection";
import ClassSubjectsSection from "./components/ClassSubjectsSection";
import ClassSummaryCard from "./components/ClassSummaryCard";

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

	const { success, data, message } = await GetClassById(id, {
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
					<h1 className="text-xl font-semibold">Class</h1>
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
					<h1 className="text-xl font-semibold">
						{data.classInfo.name}
					</h1>
				</div>

				<DialogCardBtn triggerName="Edit Class" title="Edit Class">
					<ClassForm
						isEdit={true}
						classData={{
							id: data.classMeta.id,
							name: data.classMeta.name,
							year: data.classMeta.year,
							semester: data.classMeta.semester,
							academicYearId: data.classMeta.academicYearId,
							userId: data.classMeta.userId,
						}}
					/>
				</DialogCardBtn>
			</nav>

			<ClassSummaryCard classInfo={data.classInfo} />

			<ClassSubjectsSection
				subjects={data.subjects}
				page={subjectsPage}
				pageSize={subjectsPageSize}
				total={data.subjectsTotal}
			/>

			<ClassStudentsSection
				students={data.students}
				page={studentsPage}
				pageSize={studentsPageSize}
				total={data.studentsTotal}
			/>
		</div>
	);
};

export default page;
