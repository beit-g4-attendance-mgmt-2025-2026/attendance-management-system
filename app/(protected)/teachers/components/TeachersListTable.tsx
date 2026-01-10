import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Edit2Icon, TrashIcon } from "lucide-react";
import Link from "next/link";

interface Teacher {
	id: string;
	name: string;
	username: string;
	email: string;
	gender: string;
	department: string;
	role: string;
	dateOfBirth: string;
	phone: string;
}

interface TeachersListTableProps {
	teachers: Teacher[];
	selectedTeacher: Teacher | null;
	onSelectTeacher: (teacher: Teacher) => void;
}

const TeachersListTable = ({
	teachers,
	selectedTeacher,
	onSelectTeacher,
}: TeachersListTableProps) => {
	return (
		<Table className="max-w-[100px]">
			{/* <TableCaption className="text-blue-400">Teachers List</TableCaption> */}
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">Name</TableHead>
					<TableHead>Username</TableHead>
					<TableHead>email</TableHead>
					<TableHead>Gender</TableHead>
					<TableHead>Department</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Action</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{teachers?.map((teacher) => (
					<TableRow
						key={teacher.id}
						onClick={() => onSelectTeacher(teacher)}
						className={`cursor-pointer transition-colors ${
							selectedTeacher?.id === teacher.id
								? "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
								: "hover:bg-gray-50 dark:hover:bg-gray-800"
						}`}
					>
						<TableCell>{teacher.name}</TableCell>
						<TableCell>{teacher.username}</TableCell>
						<TableCell>{teacher.email}</TableCell>
						<TableCell>{teacher.gender}</TableCell>
						<TableCell>{teacher.department}</TableCell>
						<TableCell>{teacher.role}</TableCell>
						<TableCell
							className="flex items-center gap-1"
							onClick={(e) => e.stopPropagation()} // Prevent row selection on action click
						>
							<Link
								href={"/teacher/edit"}
								className="text-blue-500"
							>
								<Edit2Icon size={16} />
							</Link>
							<Button
								variant={"destructive"}
								className="text-red-500 cursor-pointer"
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

export default TeachersListTable;
