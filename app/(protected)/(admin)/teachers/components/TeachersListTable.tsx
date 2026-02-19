import { ConfirmBtn } from "@/components/ConfirmBtn";
import { DialogCardBtn } from "@/components/DialogCardBtn";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { User } from "@/generated/prisma/client";
import { Edit, TrashIcon } from "lucide-react";
import TeacherForm from "./TeacherForm";
import { TeacherWithDepartment } from "./TeacherPageClient";

export interface TeachersListTableProps {
	teachers: TeacherWithDepartment[];
	selectedTeacher: TeacherWithDepartment | null;
	onSelectTeacher: (teacher: TeacherWithDepartment) => void;
	onDelete: (id: string) => void;
	deletingId?: string | null;
}

const TeachersListTable = ({
	teachers,
	selectedTeacher,
	onSelectTeacher,
	onDelete,
	deletingId,
}: TeachersListTableProps) => {
	return (
		<>
			<Table className="w-full">
				{/* <TableCaption className="text-blue-400">Teachers List</TableCaption> */}
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Name</TableHead>
						<TableHead>email</TableHead>
						<TableHead>Gender</TableHead>
						<TableHead>Department</TableHead>
						<TableHead>Phone</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{teachers?.map((teacher, index) => (
						<TableRow
							key={teacher.id}
							onClick={() => onSelectTeacher(teacher)}
							className={`cursor-pointer transition-colors hover:bg-blue-300  ${
								selectedTeacher?.id === teacher.id
									? "bg-blue-300 dark:bg-blue-500 "
									: ""
							} `}
						>
							<TableCell>{teacher.fullName}</TableCell>
							<TableCell>{teacher.email}</TableCell>
							<TableCell>{teacher.gender}</TableCell>
							<TableCell className="text-center">
								{teacher.department.symbol}
							</TableCell>
							<TableCell>{teacher.phoneNumber}</TableCell>
							<TableCell
								className="flex items-center gap-1"
								onClick={(e) => e.stopPropagation()} // Prevent row selection on action click
							>
								<DialogCardBtn
									triggerIcon={<Edit />}
									title="Edit Teacher"
									description=""
								>
									<TeacherForm
										isEdit={true}
										teacher={teacher}
									/>
								</DialogCardBtn>

								<ConfirmBtn
									title="Delete teacher?"
									description="This action cannot be undone."
									confirmLabel="Delete"
									onConfirm={() => onDelete(teacher.id)}
									disabled={deletingId === teacher.id}
								>
									<Button
										variant={"ghost"}
										className="text-red-500 cursor-pointer hover:text-red-700"
										disabled={deletingId === teacher.id}
									>
										<TrashIcon />
									</Button>
								</ConfirmBtn>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
};

export default TeachersListTable;
