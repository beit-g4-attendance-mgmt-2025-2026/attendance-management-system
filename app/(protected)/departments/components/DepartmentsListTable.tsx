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
import { DepartmentsListTableProps } from "@/types/index.types";
import { Edit2Icon, TrashIcon } from "lucide-react";
import Link from "next/link";

const DepartmentsListTable = ({ departments }: DepartmentsListTableProps) => {
	return (
		<Table>
			{/* <TableCaption className="text-gray-300">
				Departments List
			</TableCaption> */}
			<TableHeader>
				<TableRow className="font-semibold">
					<TableHead className="w-[100px]">Name</TableHead>
					<TableHead>Head of Department</TableHead>
					<TableHead>email</TableHead>
					<TableHead>Phone</TableHead>
					<TableHead>Teachers</TableHead>
					<TableHead>Students</TableHead>
					<TableHead>Action</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{departments?.map((department, index) => (
					<TableRow
						key={department.id}
						className={`cursor-pointer transition-colors border-none  ${
							index % 2 === 0
								? ""
								: "bg-gray-200 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 "
						}`}
					>
						<TableCell>{department.name}</TableCell>
						<TableCell>{department.head_of_department}</TableCell>
						<TableCell>{department.email}</TableCell>
						<TableCell>{department.phone}</TableCell>
						<TableCell>{department.teachers}</TableCell>
						<TableCell>{department.students}</TableCell>
						<TableCell className="flex items-center gap-1">
							<Link
								href={"/departments/edit"}
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

export default DepartmentsListTable;
