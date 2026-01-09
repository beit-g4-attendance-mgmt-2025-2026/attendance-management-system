import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const TeachersListTable = () => {
	return (
		<Table>
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
				<TableRow>
					<TableCell>Jhon Doe</TableCell>
					<TableCell>john123</TableCell>
					<TableCell>john@email.com</TableCell>
					<TableCell>Male</TableCell>
					<TableCell>IT</TableCell>
					<TableCell>Head of Department</TableCell>
					<TableCell>
						<Link href={"/id"} className="underline text-blue-400">
							Details
						</Link>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
};

export default TeachersListTable;
