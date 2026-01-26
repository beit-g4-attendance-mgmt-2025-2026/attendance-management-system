import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { SubjectListTableProps } from "@/types/index.types";

import { Edit2Icon, TrashIcon } from "lucide-react";
import Link from "next/link";

const SubjectListTable = ({ subjects }: SubjectListTableProps) => {
	return (
		<Table className="overflow-hidden">
			{/* <TableCaption className="text-gray-300">
        subjects List
      </TableCaption> */}
			<TableHeader>
				<TableRow className="font-semibold">
					<TableHead className="">Name</TableHead>
					<TableHead>Code</TableHead>
					<TableHead>Year</TableHead>
					<TableHead>Semester</TableHead>
					<TableHead>Teacher</TableHead>
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
						<TableCell>{subject.code}</TableCell>
						<TableCell>{subject.year}</TableCell>
						<TableCell>{subject.semester}</TableCell>
						<TableCell>{subject.teacher_name}</TableCell>
						<TableCell className="flex items-center gap-1">
							<Link
								href={"/subjects/edit"}
								className="text-blue-500"
							>
								<Edit2Icon size={16} />
							</Link>
							<Button
								variant={"ghost"}
								className="text-red-500 hover:text-red-700 cursor-pointer"
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

export default SubjectListTable;
