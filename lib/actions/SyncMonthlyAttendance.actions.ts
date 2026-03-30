"use server";

import { Month, Role } from "@/generated/prisma/client";
import { getUserIdFromCookies } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { handleActionErrorResponse } from "@/lib/response";
import { z } from "zod";

const SyncMonthlyAttendanceSchema = z.object({
  classId: z.string().uuid(),
  month: z.nativeEnum(Month),
  academicYearId: z.string().uuid(),
});

type SyncMonthlyAttendanceInput = z.infer<typeof SyncMonthlyAttendanceSchema>;

export async function SyncMonthlyAttendance(
  input: SyncMonthlyAttendanceInput,
): Promise<{
  success: boolean;
  data?: {
    classId: string;
    month: Month;
    academicYearId: string;
    monthlySubAttendanceCount: number;
    monthlyClassAttendanceCount: number;
  };
  message?: string;
  details?: object | null;
}> {
  try {
    const authId = await getUserIdFromCookies();
    if (!authId) return { success: false, message: "Unauthorized" };

    const admin = await prisma.admin.findUnique({ where: { id: authId } });
    let hodDepartmentId: string | null = null;
    if (!admin) {
      const user = await prisma.user.findUnique({
        where: { id: authId },
        select: { id: true, role: true, departmentId: true },
      });
      if (!user) return { success: false, message: "Unauthorized" };
      if (user.role !== Role.HOD) {
        return { success: false, message: "Forbidden" };
      }
      hodDepartmentId = user.departmentId;
    }

    const validated = SyncMonthlyAttendanceSchema.parse(input);

    const result = await prisma.$transaction(async (tx) => {
      const classRecord = await tx.class.findFirst({
        where: {
          id: validated.classId,
          academicYearId: validated.academicYearId,
          ...(hodDepartmentId ? { departmentId: hodDepartmentId } : {}),
        },
        select: {
          id: true,
          students: {
            select: { id: true },
          },
        },
      });

      if (!classRecord) {
        throw new Error("Class not found for the selected academic year");
      }

      const studentIds = classRecord.students.map(({ id }) => id);
      if (studentIds.length === 0) {
        return {
          monthlySubAttendanceCount: 0,
          monthlyClassAttendanceCount: 0,
        };
      }

      // Narrow `any` bridges the period before `prisma generate` is run for
      // the new DailyAttendance/Monthly* schema fields.
      const grouped = await (tx.dailyAttendance.groupBy as any)({
        by: ["studentId", "subjectId"],
        where: {
          classId: validated.classId,
          month: validated.month,
          studentId: { in: studentIds },
        },
        _sum: {
          times: true,
          totalTimes: true,
        },
      });

      const studentTotals = new Map<
        string,
        { times: number; totalTimes: number }
      >();

      for (const row of grouped) {
        const current = studentTotals.get(row.studentId) ?? {
          times: 0,
          totalTimes: 0,
        };
        studentTotals.set(row.studentId, {
          times: current.times + (row._sum.times ?? 0),
          totalTimes: current.totalTimes + (row._sum.totalTimes ?? 0),
        });
      }

      const monthlyClassRecords = await Promise.all(
        studentIds.map((studentId) => {
          const totals = studentTotals.get(studentId) ?? {
            times: 0,
            totalTimes: 0,
          };
          return (tx.monthlyClassAttendance.upsert as any)({
            where: {
              studentId_classId_month_academicYearId: {
                studentId,
                classId: validated.classId,
                month: validated.month,
                academicYearId: validated.academicYearId,
              },
            },
            update: {
              totalTimes: totals.totalTimes,
              status:
                totals.totalTimes > 0 &&
                totals.times / totals.totalTimes >= 0.75,
            },
            create: {
              studentId,
              classId: validated.classId,
              month: validated.month,
              academicYearId: validated.academicYearId,
              totalTimes: totals.totalTimes,
              status:
                totals.totalTimes > 0 &&
                totals.times / totals.totalTimes >= 0.75,
              monthlySubAttendanceId: [],
            },
            select: { id: true, studentId: true },
          });
        }),
      );

      const monthlyClassIdByStudent = new Map(
        monthlyClassRecords.map((row) => [row.studentId, row.id]),
      );

      const monthlySubRecords = await Promise.all(
        grouped.map((row: any) =>
          (tx.monthlySubAttendance.upsert as any)({
            where: {
              studentId_subjectId_month_academicYearId: {
                studentId: row.studentId,
                subjectId: row.subjectId,
                month: validated.month,
                academicYearId: validated.academicYearId,
              },
            },
            update: {
              times: row._sum.times ?? 0,
              totalTimes: row._sum.totalTimes ?? 0,
              status:
                (row._sum.totalTimes ?? 0) > 0 &&
                (row._sum.times ?? 0) / (row._sum.totalTimes ?? 0) >= 0.75,
              monthlyClassAttendanceId: monthlyClassIdByStudent.get(
                row.studentId,
              ),
            },
            create: {
              studentId: row.studentId,
              subjectId: row.subjectId,
              month: validated.month,
              academicYearId: validated.academicYearId,
              times: row._sum.times ?? 0,
              totalTimes: row._sum.totalTimes ?? 0,
              status:
                (row._sum.totalTimes ?? 0) > 0 &&
                (row._sum.times ?? 0) / (row._sum.totalTimes ?? 0) >= 0.75,
              monthlyClassAttendanceId: monthlyClassIdByStudent.get(
                row.studentId,
              ),
            },
            select: { id: true, studentId: true },
          }),
        ),
      );

      const monthlySubIdsByStudent = monthlySubRecords.reduce(
        (map, row) =>
          map.set(row.studentId, [...(map.get(row.studentId) ?? []), row.id]),
        new Map<string, string[]>(),
      );

      await Promise.all(
        monthlyClassRecords.map((row) =>
          (tx.monthlyClassAttendance.update as any)({
            where: { id: row.id },
            data: {
              monthlySubAttendanceId:
                monthlySubIdsByStudent.get(row.studentId) ?? [],
            },
          }),
        ),
      );

      return {
        monthlySubAttendanceCount: monthlySubRecords.length,
        monthlyClassAttendanceCount: monthlyClassRecords.length,
      };
    });

    return {
      success: true,
      data: {
        classId: validated.classId,
        month: validated.month,
        academicYearId: validated.academicYearId,
        monthlySubAttendanceCount: result.monthlySubAttendanceCount,
        monthlyClassAttendanceCount: result.monthlyClassAttendanceCount,
      },
    };
  } catch (error) {
    return handleActionErrorResponse(error);
  }
}
