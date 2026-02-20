"use client";
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
import { Edit, TrashIcon } from "lucide-react";
import TeacherForm from "./TeacherForm";
import { TeacherWithDepartment } from "../page";
import { api } from "@/lib/api";
import { toast } from "sonner";

export interface TeachersListTableProps {
	teachers: TeacherWithDepartment[];
}

const TeachersListTable = ({ teachers }: TeachersListTableProps) => {
	const handleDelete = async (id: string) => {
		try {
			const res = await api.users.delete(id);
			if (res.success) toast.success("User deleted successfully!");
		} catch (error: any) {
			console.log(error);
			toast.error(error);
		}
	};
	return (
		<>
			<Table className="w-full">
				{/* <TableCaption className="text-blue-400">Teachers List</TableCaption> */}
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
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
							className={`cursor-pointer 	${
								index % 2 === 0
									? ""
									: "bg-blue-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-50 "
							}`}
						>
							<TableCell>{teacher.fullName}</TableCell>
							<TableCell>{teacher.email}</TableCell>
							<TableCell>{teacher.gender}</TableCell>
							<TableCell className="text-center">
								{teacher.department.symbol}
							</TableCell>
							<TableCell>{teacher.phoneNumber}</TableCell>
							<TableCell className="flex items-center gap-1">
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
									onConfirm={() => handleDelete(teacher.id)}
								>
									<Button
										variant={"ghost"}
										className="text-red-500 cursor-pointer hover:text-red-700"
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
