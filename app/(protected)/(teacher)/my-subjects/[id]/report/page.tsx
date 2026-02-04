import BackBtn from "@/components/BackBtn";
import SubjectAttendanceTable from "@/components/SubjectAttendanceTable";
import { Button } from "@/components/ui/button";
import { attendanceReportData } from "@/constants/index.constants";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const decodedCode = decodeURIComponent(id);
	return (
		<main>
			<nav className="flex justify-between items-center">
				<div className="flex items-center gap-5">
					<BackBtn />
					<span className="text-xl font-semibold">{decodedCode}</span>
				</div>
				<div className="flex gap-3">
					<Button
						variant={"link"}
						className="cursor-pointer text-sky-600"
					>
						Export CSV
					</Button>
					<Button className="cursor-pointer text-white bg-sky-600 hover:bg-sky-700 hover:text-white">
						Submit
					</Button>
				</div>
			</nav>
			<SubjectAttendanceTable data={attendanceReportData} />
		</main>
	);
};

export default page;
