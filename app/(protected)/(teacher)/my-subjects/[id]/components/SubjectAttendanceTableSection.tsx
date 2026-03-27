"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { STUDENTS, times } from "@/constants/index.constants";
import FormSelect from "@/components/inputs/FormSelect";
import { useWatch, type UseFormReturn } from "react-hook-form";
import type { TakeAttendanceFormValues } from "./types";

type Props = {
	form: UseFormReturn<TakeAttendanceFormValues>;
	onSubmit: (values: TakeAttendanceFormValues) => void;
};

const SubjectAttendanceTableSection = ({ form, onSubmit }: Props) => {
	const timesMap = useWatch({
		control: form.control,
		name: "Times",
	});

	return (
		<form id="attendance" onSubmit={form.handleSubmit(onSubmit)}>
			<input type="hidden" {...form.register("SubjectId")} />
			<Table className="max-w-4xl mx-auto">
				<TableHeader>
					<TableRow>
						<TableHead className="text-center">No</TableHead>
						<TableHead>Name</TableHead>
						<TableHead className="text-center">Roll-No</TableHead>
						<TableHead className="text-center">Times</TableHead>
						<TableHead className="text-center">Status</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{STUDENTS.map((student, index) => {
						const studentTimes = timesMap?.[student.student_id];
						return (
							<TableRow
								key={student.id}
								className={`hover:bg-red-50 ${
									studentTimes === "0" ? "bg-red-50" : ""
								}`}
							>
								<TableCell className="text-center">{index + 1}</TableCell>
								<TableCell>{student.name}</TableCell>
								<TableCell className="text-center">
									{student.student_id}
								</TableCell>
								<TableCell>
									<FormSelect
										form={form}
										name={`Times.${student.student_id}`}
										placeholder="Times"
										options={times}
									/>
								</TableCell>
								<TableCell className="text-center font-semibold">
									{studentTimes === "0" ? "A" : "P"}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</form>
	);
};

export default SubjectAttendanceTableSection;
