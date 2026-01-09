import TeacherNavbar from "@/components/TeacherNavbar";
import TeacherListTable from "./components/TeachersListTable";
import { Paginationn } from "@/components/Pagination";

const page = () => {
	return (
		<main>
			<TeacherNavbar />
			<TeacherListTable />

			<div className="mt-6">
				<Paginationn />
			</div>
		</main>
	);
};

export default page;
