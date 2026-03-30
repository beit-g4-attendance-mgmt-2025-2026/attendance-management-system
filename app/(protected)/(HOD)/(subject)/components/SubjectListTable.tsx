"use client";

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
import { SubjectWithDetails } from "../../../../../lib/actions/GetSubjects.actions";
import { DialogCardBtn } from "@/components/DialogCardBtn";
import SubjectForm from "./SubjectForm";
import { ConfirmBtn } from "@/components/ConfirmBtn";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
export interface SubjectListTableProps {
	subjects: SubjectWithDetails[];
}

const SubjectListTable = ({ subjects }: SubjectListTableProps) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const handleDelete = async (id: string) => {
		try {
			setLoading(true);
			const res = await api.subjects.delete(id);
			if (res.success) toast.success(res.data.message);
			router.refresh();
		} catch (error: any) {
			console.log(error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};
	return (
		<Table className="overflow-hidden">
			<TableHeader>
				<TableRow className="font-semibold">
					<TableHead className="">Name</TableHead>
					<TableHead>Code</TableHead>
					<TableHead>Year</TableHead>
					<TableHead>Semester</TableHead>
					<TableHead>Teacher</TableHead>
					<TableHead>Room</TableHead>
					<TableHead>Action</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{subjects?.map((subject, index) => (
					<TableRow
						key={subject.id}
						className={`cursor-pointer transition-colors border-none  ${
							index % 2 === 0
								? ""
								: "bg-gray-200 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 "
						}`}
					>
						<TableCell>{subject.name}</TableCell>
						<TableCell>{subject.subCode}</TableCell>

						<TableCell>
							{subject.class.year.charAt(0).toUpperCase() +
								subject.class.year.slice(1).toLowerCase() +
								" "}
							Year
						</TableCell>
						<TableCell>{subject.class.semester}</TableCell>
						<TableCell>{subject.user?.fullName}</TableCell>
						<TableCell
							className={`${subject.roomName ? "" : "text-amber-600"} `}
						>
							{subject.roomName ?? "Not assigned"}
						</TableCell>

						<TableCell className="flex items-center gap-1">
							<DialogCardBtn
								triggerIcon={<Edit />}
								title="Edit Teacher"
								description=""
							>
								<SubjectForm isEdit={true} subject={subject} />
							</DialogCardBtn>

							<ConfirmBtn
								title="Delete subject?"
								description="This action cannot be undone."
								confirmLabel="Delete"
								onConfirm={() => handleDelete(subject.id)}
							>
								<Button
									disabled={loading}
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
	);
};

export default SubjectListTable;
