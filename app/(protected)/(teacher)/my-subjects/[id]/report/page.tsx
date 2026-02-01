// "use client";
import SubjectAttendanceTable from "@/components/SubjectAttendanceTable";
import { Button } from "@/components/ui/button";
import { attendanceReportData } from "@/constants/index.constants";
import { useRouter } from "next/navigation";
import { IoChevronBackSharp } from "react-icons/io5";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const decodedCode = decodeURIComponent(id);
	// const router = useRouter();
	return (
		<main>
			<nav className="flex justify-between items-center">
				<div className="flex items-center gap-5">
					<IoChevronBackSharp
						className="size-6 mt-1 cursor-pointer"
						// onClick={() => router.back()}
					/>
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
