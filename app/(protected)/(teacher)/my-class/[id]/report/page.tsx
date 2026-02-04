import BackBtn from "@/components/BackBtn";
import ClassAttendanceTable from "@/components/ClassAttendanceTable";
import { Button } from "@/components/ui/button";
import { IoChevronBackSharp } from "react-icons/io5";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const decodedCode = decodeURIComponent(id);
	return (
		<div>
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
			<ClassAttendanceTable />
		</div>
	);
};

export default page;
