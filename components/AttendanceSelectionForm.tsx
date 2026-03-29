"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import DailyAttendance, {
	type DailyAttendanceStudent,
} from "@/components/DailyAttendance";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	GetAttendanceSelectionData,
	GetAttendanceStudentsForSelection,
} from "@/lib/actions/GetAttendanceSelectionData.actions";

type SelectionData = {
	classes: {
		id: string;
		name: string;
		academicYearId: string | null;
		academicYearName: string | null;
	}[];
	subjects: {
		id: string;
		name: string;
		subCode: string;
		classId: string;
		className: string;
		academicYearId: string | null;
	}[];
	academicYears: {
		id: string;
		name: string;
		isActive: boolean;
	}[];
};

type AttendanceConfig = {
	subjectId: string;
	totalTimes: string;
	day: number;
	month: string;
};

const getTodayDate = () => new Date().toISOString().slice(0, 10);

export default function AttendanceSelectionForm() {
	const [selectionData, setSelectionData] = useState<SelectionData | null>(null);
	const [students, setStudents] = useState<DailyAttendanceStudent[]>([]);
	const [attendanceConfig, setAttendanceConfig] =
		useState<AttendanceConfig | null>(null);
	const [academicYearId, setAcademicYearId] = useState("");
	const [classId, setClassId] = useState("");
	const [subjectId, setSubjectId] = useState("");
	const [totalTimes, setTotalTimes] = useState("1");
	const [date, setDate] = useState(getTodayDate);
	const [isLoadingOptions, startLoadingOptions] = useTransition();
	const [isFetchingStudents, startFetchingStudents] = useTransition();

	useEffect(() => {
		startLoadingOptions(async () => {
			const result = await GetAttendanceSelectionData();

			if (!result.success || !result.data) {
				toast.error(result.message ?? "Failed to load attendance form data.");
				return;
			}

			setSelectionData(result.data);

			const defaultAcademicYear =
				result.data.academicYears.find((year) => year.isActive)?.id ??
				result.data.academicYears[0]?.id ??
				"";
			setAcademicYearId(defaultAcademicYear);
		});
	}, []);

	const availableClasses =
		selectionData?.classes.filter((item) =>
			academicYearId ? item.academicYearId === academicYearId : true,
		) ?? [];

	useEffect(() => {
		if (!availableClasses.length) {
			setClassId("");
			return;
		}

		if (!availableClasses.some((item) => item.id === classId)) {
			setClassId(availableClasses[0].id);
		}
	}, [availableClasses, classId]);

	const availableSubjects =
		selectionData?.subjects.filter((item) => {
			const matchesClass = classId ? item.classId === classId : true;
			const matchesAcademicYear = academicYearId
				? item.academicYearId === academicYearId
				: true;
			return matchesClass && matchesAcademicYear;
		}) ?? [];

	useEffect(() => {
		if (!availableSubjects.length) {
			setSubjectId("");
			return;
		}

		if (!availableSubjects.some((item) => item.id === subjectId)) {
			setSubjectId(availableSubjects[0].id);
		}
	}, [availableSubjects, subjectId]);

	useEffect(() => {
		setStudents([]);
		setAttendanceConfig(null);
	}, [academicYearId, classId, subjectId, totalTimes, date]);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!classId || !subjectId) {
			toast.error("Please choose a class and subject.");
			return;
		}

		startFetchingStudents(async () => {
			const result = await GetAttendanceStudentsForSelection({
				classId,
				subjectId,
				academicYearId: academicYearId || undefined,
			});

			if (!result.success || !result.data) {
				toast.error(result.message ?? "Failed to fetch students.");
				return;
			}

			const selectedDate = new Date(`${date}T00:00:00`);
			const month = selectedDate.toLocaleString("en-US", {
				month: "long",
			});

			setStudents(result.data.students);
			setAttendanceConfig({
				subjectId,
				totalTimes,
				day: selectedDate.getDate(),
				month,
			});

			if (result.data.students.length === 0) {
				toast.error("No students found for the selected class.");
				return;
			}

			toast.success("Students loaded. You can mark attendance now.");
		});
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Attendance Selection</CardTitle>
					<CardDescription>
						Choose the class, subject, academic year, total times, and date
						before taking attendance.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoadingOptions && !selectionData ? (
						<div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
							<Loader2 className="mr-2 animate-spin" />
							Loading attendance setup...
						</div>
					) : (
						<form className="space-y-6" onSubmit={handleSubmit}>
							<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
								<div className="space-y-2">
									<Label htmlFor="attendance-class">Class</Label>
									<Select value={classId} onValueChange={setClassId}>
										<SelectTrigger
											id="attendance-class"
											className="w-full"
										>
											<SelectValue placeholder="Select class" />
										</SelectTrigger>
										<SelectContent>
											{availableClasses.map((item) => (
												<SelectItem key={item.id} value={item.id}>
													{item.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="attendance-subject">Subject</Label>
									<Select value={subjectId} onValueChange={setSubjectId}>
										<SelectTrigger
											id="attendance-subject"
											className="w-full"
										>
											<SelectValue placeholder="Select subject" />
										</SelectTrigger>
										<SelectContent>
											{availableSubjects.map((item) => (
												<SelectItem key={item.id} value={item.id}>
													{item.subCode} - {item.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="attendance-academic-year">
										Academic Year
									</Label>
									<Select
										value={academicYearId}
										onValueChange={setAcademicYearId}
									>
										<SelectTrigger
											id="attendance-academic-year"
											className="w-full"
										>
											<SelectValue placeholder="Select academic year" />
										</SelectTrigger>
										<SelectContent>
											{selectionData?.academicYears.map((item) => (
												<SelectItem key={item.id} value={item.id}>
													{item.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
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

							<div className="grid gap-4 md:grid-cols-[minmax(0,280px)_auto] md:items-end">
								<div className="space-y-2">
									<Label htmlFor="attendance-date">Date</Label>
									<Input
										id="attendance-date"
										type="date"
										value={date}
										onChange={(event) => setDate(event.target.value)}
									/>
								</div>

								<div className="flex items-end">
									<Button
										type="submit"
										disabled={
											isFetchingStudents ||
											!classId ||
											!subjectId ||
											!date ||
											Number(totalTimes) <= 0
										}
									>
										{isFetchingStudents ? (
											<>
												<Loader2 className="animate-spin" />
												Loading Students...
											</>
										) : (
											<>
												<Search />
												Load Students
											</>
										)}
									</Button>
								</div>
							</div>
						</form>
					)}
				</CardContent>
			</Card>

			{attendanceConfig && students.length > 0 ? (
				<DailyAttendance
					students={students}
					subjectId={attendanceConfig.subjectId}
					totalTimes={attendanceConfig.totalTimes}
					day={attendanceConfig.day}
					month={attendanceConfig.month}
				/>
			) : null}
		</div>
	);
}
