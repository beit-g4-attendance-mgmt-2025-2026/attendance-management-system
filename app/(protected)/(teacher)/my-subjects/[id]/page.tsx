import SubjectAttendanceEditor from "@/components/SubjectAttendanceEditor";
import { GetSubjectAttendanceForDate } from "@/lib/actions/GetSubjectAttendanceForDate.actions";

const today = new Date();
const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

const Page = async ({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ date?: string }>;
}) => {
	const { id } = await params;
	const query = await searchParams;
	const attendance = await GetSubjectAttendanceForDate({
		subjectId: id,
		date: query.date ?? defaultDate,
	});

	if (!attendance.success || !attendance.data) {
		return (
			<div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
				{attendance.message ?? "Unable to load subject attendance."}
			</div>
		);
	}

	return <SubjectAttendanceEditor initialData={attendance.data} />;
};

export default Page;
