import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TeachersListTableProps } from "@/types/index.types";
import { Edit2Icon, TrashIcon } from "lucide-react";
import Link from "next/link";

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
				{teachers?.map((teacher, index) => (
					<TableRow
						key={teacher.id}
						onClick={() => onSelectTeacher(teacher)}
						className={`cursor-pointer transition-colors ${
							selectedTeacher?.id === teacher.id
								? "bg-blue-300 dark:bg-blue-500 "
								: ""
						} `}
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
