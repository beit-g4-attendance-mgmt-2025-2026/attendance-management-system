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
import { Student, StudentsListTableProps } from "@/types/index.types";
import { Edit2Icon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { Paginationn } from "./Pagination";
import { StudentProfileCard } from "@/app/(protected)/(admin)/students/components/StudentProfileCard";
import { useState } from "react";

const ClassDetailsTable = ({ students }: StudentsListTableProps) => {
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(
		null
	);
	return (
		<>
			<div className=" flex flex-col justify-between">
				<Table className="w-full">
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">No</TableHead>
							<TableHead>Roll No</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Gender</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Phone No.</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{students?.map((student, index) => (
							<TableRow
								key={student.id}
								onClick={() => setSelectedStudent(student)}
								className={`cursor-pointer transition-colors hover:bg-blue-300 ${
									selectedStudent?.id === student.id
										? "bg-blue-300 dark:bg-blue-500 "
										: ""
								} `}
							>
								<TableCell>{index + 1}</TableCell>
								<TableCell>{student.student_id}</TableCell>
								<TableCell>{student.name}</TableCell>
								<TableCell>{student.gender}</TableCell>
								<TableCell>{student.email}</TableCell>
								<TableCell>{student.phone}</TableCell>
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

				<div>
					<Paginationn />
				</div>
			</div>
			<StudentProfileCard student={selectedStudent} />
		</>
	);
};

export default ClassDetailsTable;
