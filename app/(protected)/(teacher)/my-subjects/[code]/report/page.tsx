import SubjectAttendanceTable from "@/components/SubjectAttendanceTable";
import { attendanceReportData } from "@/constants/index.constants";
import React from "react";

const page = () => {
	return (
		<main className="p-6">
			<SubjectAttendanceTable data={attendanceReportData} />
		</main>
	);
};

export default page;
