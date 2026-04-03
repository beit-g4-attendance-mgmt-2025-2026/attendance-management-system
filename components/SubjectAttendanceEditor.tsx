"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import BackBtn from "@/components/BackBtn";
import DailyAttendance, {
  type DailyAttendanceStudent,
} from "@/components/DailyAttendance";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClearSubjectAttendanceForDate } from "@/lib/actions/ClearSubjectAttendanceForDate.actions";
import { GetSubjectAttendanceForDate } from "@/lib/actions/GetSubjectAttendanceForDate.actions";
import { MoveSubjectAttendanceDate } from "@/lib/actions/MoveSubjectAttendanceDate.actions";

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
  const [hasSavedAttendance, setHasSavedAttendance] = useState(
    initialData.hasSavedAttendance,
  );
  const [savedCount, setSavedCount] = useState(initialData.savedCount);
  const [correctedDate, setCorrectedDate] = useState("");
  const [isLoadingAttendance, startLoadingAttendance] = useTransition();
  const [isClearing, startClearing] = useTransition();
  const [isMoving, startMoving] = useTransition();

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
      setHasSavedAttendance(result.data.hasSavedAttendance);
      setSavedCount(result.data.savedCount);
    });
  };

  const handleClearAttendance = () => {
    startClearing(async () => {
      const result = await ClearSubjectAttendanceForDate({
        subjectId: initialData.subject.id,
        date,
      });

      if (!result.success) {
        toast.error(result.message ?? "Failed to clear attendance.");
        return;
      }

      toast.success(result.message ?? "Attendance cleared successfully.");
      reloadAttendance(date);
    });
  };

  const handleMoveAttendance = () => {
    if (!correctedDate) {
      toast.error("Please choose the correct date first.");
      return;
    }

    startMoving(async () => {
      const result = await MoveSubjectAttendanceDate({
        subjectId: initialData.subject.id,
        fromDate: date,
        toDate: correctedDate,
      });

      if (!result.success) {
        toast.error(result.message ?? "Failed to change attendance date.");
        return;
      }

      toast.success(result.message ?? "Attendance date updated successfully.");
      reloadAttendance(correctedDate);
      setCorrectedDate("");
    });
  };

  const isBusy = isLoadingAttendance || isClearing || isMoving;

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
              disabled={isBusy}
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
              disabled={isBusy}
              onChange={(event) => setTotalTimes(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attendance-correct-date">Correct To</Label>
            <Input
              id="attendance-correct-date"
              type="date"
              value={correctedDate}
              disabled={isBusy}
              onChange={(event) => setCorrectedDate(event.target.value)}
            />
          </div>
        </div>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/30 p-4">
        <div className="text-sm text-muted-foreground">
          {hasSavedAttendance
            ? `${savedCount} saved attendance records are loaded for ${date}.`
            : `No saved attendance records were found for ${date} yet.`}
        </div>
        <div className="flex flex-wrap gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={!hasSavedAttendance || isBusy}
              >
                <Trash2 className="size-4" />
                Clear Attendance Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive">
                  <Trash2 />
                </AlertDialogMedia>
                <AlertDialogTitle>Clear saved attendance?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all saved attendance records for {date}. Use
                  this only when the whole day&apos;s attendance was taken by
                  mistake.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isClearing}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={isClearing}
                  onClick={handleClearAttendance}
                >
                  {isClearing ? "Clearing..." : "Clear Data"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="bg-sky-600 hover:bg-sky-700"
                disabled={
                  !hasSavedAttendance ||
                  !correctedDate ||
                  correctedDate === date ||
                  isBusy
                }
              >
                Change Attendance Date
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-amber-100 text-amber-700">
                  <AlertTriangle />
                </AlertDialogMedia>
                <AlertDialogTitle>
                  Move attendance to another date?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will move all saved attendance for {date} to{" "}
                  {correctedDate || "the selected date"}. If attendance already
                  exists on the target date, the move will be blocked to prevent
                  accidental overwrite.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="destructive" disabled={isMoving}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-sky-600 hover:bg-sky-700"
                  disabled={
                    isMoving || !correctedDate || correctedDate === date
                  }
                  onClick={handleMoveAttendance}
                >
                  {isMoving ? "Changing..." : "Change Date"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

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
        for editing. If you saved the whole day under the wrong date, use
        `Change Attendance Date`. If the whole record should be removed, use
        `Clear Attendance Data`.
      </p>
    </main>
  );
}
