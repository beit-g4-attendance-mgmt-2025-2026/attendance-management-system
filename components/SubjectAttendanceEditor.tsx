"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import BackBtn from "@/components/BackBtn";
import DailyAttendance, {
	type DailyAttendanceStudent,
} from "@/components/DailyAttendance";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GetSubjectAttendanceForDate } from "@/lib/actions/GetSubjectAttendanceForDate.actions";

type Props = {
	initialData: NonNullable<
		Awaited<ReturnType<typeof GetSubjectAttendanceForDate>>["data"]
	>;
};

export default function SubjectAttendanceEditor({ initialData }: Props) {
	const [date, setDate] = useState(initialData.date);
	const [totalTimes, setTotalTimes] = useState(String(initialData.totalTimes));
	const [students, setStudents] = useState<DailyAttendanceStudent[]>(
		initialData.students,
	);
	const [day, setDay] = useState(initialData.day);
	const [month, setMonth] = useState(initialData.month);
	const [isLoadingAttendance, startLoadingAttendance] = useTransition();

	const reloadAttendance = (nextDate: string) => {
		setDate(nextDate);

		startLoadingAttendance(async () => {
			const result = await GetSubjectAttendanceForDate({
				subjectId: initialData.subject.id,
				date: nextDate,
			});

			if (!result.success || !result.data) {
				toast.error(result.message ?? "Failed to load attendance data.");
				return;
			}

			setStudents(result.data.students);
			setTotalTimes(String(result.data.totalTimes));
			setDay(result.data.day);
			setMonth(result.data.month);
		});
	};

	return (
		<main className="space-y-6">
			<nav className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<BackBtn />
					<div>
						<h1 className="text-xl font-semibold">
							{initialData.subject.name}
						</h1>
						<p className="text-sm text-muted-foreground">
							{initialData.subject.subCode} - {initialData.subject.className}
						</p>
					</div>
				</div>
				<div className="flex flex-wrap items-end gap-4">
					<div className="space-y-2">
						<Label htmlFor="attendance-date">Date</Label>
						<Input
							id="attendance-date"
							type="date"
							value={date}
							onChange={(event) => reloadAttendance(event.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="attendance-total-times">Total Times</Label>
						<Input
							id="attendance-total-times"
							type="number"
							min="1"
							max="4"
							step="1"
							value={totalTimes}
							onChange={(event) => setTotalTimes(event.target.value)}
						/>
					</div>
				</div>
			</nav>

			{isLoadingAttendance ? (
				<div className="flex min-h-40 items-center justify-center rounded-xl border text-sm text-muted-foreground">
					<Loader2 className="mr-2 animate-spin" />
					Loading saved attendance...
				</div>
			) : (
				<DailyAttendance
					students={students}
					subjectId={initialData.subject.id}
					totalTimes={totalTimes}
					day={day}
					month={month}
					onSaveAttendance={() => reloadAttendance(date)}
				/>
			)}

			<p className="text-sm text-muted-foreground">
				Change the date to load any saved attendance automatically. If that day
				already has records, the previous present and absent states are loaded
				for editing.
			</p>
		</main>
	);
}
