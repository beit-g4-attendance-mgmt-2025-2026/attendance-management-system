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
import { Edit, Loader2, Mail, TrashIcon } from "lucide-react";
import TeacherForm from "./TeacherForm";
import type { TeacherWithDepartment } from "../page";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface TeachersListTableProps {
	teachers: TeacherWithDepartment[];
}

const TeachersListTable = ({ teachers }: TeachersListTableProps) => {
	const router = useRouter();
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [sendingResetId, setSendingResetId] = useState<string | null>(null);

	const handleDelete = async (id: string) => {
		try {
			setDeletingId(id);
			const res = await api.users.delete(id);
			if (res.success) toast.success(res.data.message);
			router.refresh();
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setDeletingId(null);
		}
	};

	const handleSendResetEmail = async (id: string) => {
		try {
			setSendingResetId(id);
			const res = await api.users.sendResetEmail(id);
			if (res?.success) {
				toast.success(
					res?.data?.message ??
						"Password reset email sent successfully",
				);
			}
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setSendingResetId(null);
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
							className={`cursor-pointer transition-colors border-none  ${
								index % 2 === 0
									? ""
									: "bg-gray-200 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 "
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
									title="Send password reset email?"
									description={`A reset link will be sent to ${teacher.email}.`}
									confirmLabel="Send Email"
									onConfirm={() =>
										handleSendResetEmail(teacher.id)
									}
									disabled={
										sendingResetId === teacher.id ||
										deletingId === teacher.id
									}
								>
									<Button
										type="button"
										variant="ghost"
										title="Send forgot password email"
										disabled={
											sendingResetId === teacher.id ||
											deletingId === teacher.id
										}
										className="text-amber-600 cursor-pointer hover:text-amber-700"
									>
										{sendingResetId === teacher.id ? (
											<Loader2 className="size-4 animate-spin" />
										) : (
											<Mail className="size-4" />
										)}
									</Button>
								</ConfirmBtn>

								<ConfirmBtn
									title="Delete teacher?"
									description="This action cannot be undone."
									confirmLabel="Delete"
									onConfirm={() => handleDelete(teacher.id)}
								>
									<Button
										disabled={
											deletingId === teacher.id ||
											sendingResetId === teacher.id
										}
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
