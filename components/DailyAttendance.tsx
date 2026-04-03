"use client";

import { useEffect, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Month } from "@/generated/prisma/enums";
import { SaveDailyAttendance } from "@/lib/actions/SaveDailyAttendance.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type DailyAttendanceStudent = {
  id: string;
  rollNo: string;
  name: string;
  isPresent: boolean;
};

type DailyAttendanceProps = {
  students: DailyAttendanceStudent[];
  subjectId: string;
  totalTimes: number | string;
  day?: number;
  month?: string;
  onSaveAttendance?: (attendance: DailyAttendanceStudent[]) => void;
};

export default function DailyAttendance({
  students,
  subjectId,
  totalTimes,
  day,
  month,
  onSaveAttendance,
}: DailyAttendanceProps) {
  const [attendance, setAttendance] =
    useState<DailyAttendanceStudent[]>(students);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setAttendance(students);
  }, [students]);

  const presentCount = attendance.filter((student) => student.isPresent).length;

  const updateAttendance = (studentId: string, isPresent: boolean) => {
    setAttendance((currentAttendance) =>
      currentAttendance.map((student) =>
        student.id === studentId ? { ...student, isPresent } : student,
      ),
    );
  };

  const markAllPresent = () => {
    setAttendance((currentAttendance) =>
      currentAttendance.map((student) => ({ ...student, isPresent: true })),
    );
  };

  const normalizedMonth = month?.toUpperCase() as
    | keyof typeof Month
    | undefined;
  const parsedTotalTimes =
    typeof totalTimes === "string" ? Number(totalTimes) : totalTimes;
  const canSave =
    attendance.length > 0 && subjectId && Number.isFinite(parsedTotalTimes);

  const saveAttendance = () => {
    startTransition(async () => {
      try {
        const result = await SaveDailyAttendance({
          subjectId,
          totalTimes: parsedTotalTimes,
          day,
          month: normalizedMonth ? Month[normalizedMonth] : undefined,
          attendance: attendance.map((student) => ({
            studentId: student.id,
            status: student.isPresent ? "present" : "absent",
          })),
        });

        if (result.success) {
          toast.success(
            result.message ??
              `Attendance saved for ${result.data?.savedCount ?? attendance.length} students.`,
          );
          onSaveAttendance?.(attendance);
          return;
        }

        toast.error(result.message ?? "Failed to save attendance.");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save attendance.",
        );
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Daily Attendance</CardTitle>
          <CardDescription>
            Mark each student as present or absent for today.
          </CardDescription>
        </div>
        <Button
          className="bg-sky-600 hover:bg-sky-700"
          onClick={markAllPresent}
          disabled={isPending}
        >
          Mark All Present
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Roll No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-[180px] text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.rollNo}
                  </TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-3">
                      <span
                        className={
                          student.isPresent
                            ? "text-sm font-medium text-emerald-600"
                            : "text-red-500 text-sm font-medium"
                        }
                      >
                        {student.isPresent ? "Present" : "Absent"}
                      </span>
                      <Switch
                        checked={student.isPresent}
                        onCheckedChange={(checked) =>
                          updateAttendance(student.id, checked)
                        }
                        aria-label={`Mark ${student.name} as ${
                          student.isPresent ? "absent" : "present"
                        }`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="text-muted-foreground text-sm">
          Present: {presentCount} / {attendance.length}
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <Button
          className="bg-sky-600 hover:bg-sky-700"
          onClick={saveAttendance}
          disabled={isPending || !canSave}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Saving...
            </>
          ) : (
            "Save Attendance"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
