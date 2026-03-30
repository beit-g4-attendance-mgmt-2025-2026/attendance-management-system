export type TakeAttendanceFormValues = {
	SubjectId: string;
	Day: string;
	Month: string;
	TotalTimes: string;
	Times: Record<string, string>;
};
