import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { StudentsListTableProps } from "@/types/index.types";
import { Edit2Icon, TrashIcon } from "lucide-react";
import Link from "next/link";

const StudentsListTable = ({
	students,
	selectedStudent,
	onSelectStudent,
}: StudentsListTableProps) => {
	return (
		<Table className="w-full">
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">Name</TableHead>
					<TableHead>Student ID</TableHead>
					<TableHead>Email address</TableHead>
					<TableHead>Gender</TableHead>
					<TableHead>Department</TableHead>
					<TableHead>Semester</TableHead>
					<TableHead>Action</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{students?.map((student, index) => (
					<TableRow
						key={student.id}
						onClick={() => onSelectStudent(student)}
						className={`cursor-pointer transition-colors hover:bg-blue-300 ${
							selectedStudent?.id === student.id
								? "bg-blue-300 dark:bg-blue-500 "
								: ""
						} `}
					>
						<TableCell>{student.name}</TableCell>
						<TableCell>{student.student_id}</TableCell>
						<TableCell>{student.email}</TableCell>
						<TableCell>{student.gender}</TableCell>
						<TableCell>{student.department}</TableCell>
						<TableCell>{student.semester}</TableCell>
						<TableCell
							className="flex items-center gap-1"
							onClick={(e) => e.stopPropagation()} // Prevent row selection on action click
						>
							<Link
								href={"/students/edit"}
								className="text-blue-500"
							>
								<Edit2Icon size={16} />
							</Link>
							<Button
								variant={"ghost"}
								className="text-red-500 cursor-pointer hover:text-red-700"
							>
								<TrashIcon />
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default StudentsListTable;
