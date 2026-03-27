"use server";

import { Role, type Prisma, type User } from "@/generated/prisma/client";
import { StudentWithDetails } from "@/types/index.types";
import { getUserIdFromCookies } from "../jwt";
import { prisma } from "../prisma";
import { handleActionErrorResponse } from "../response";
import validateBody from "../validateBody";
import PaginatedSearchParamsSchema from "../schema/PaginatedSearchParamsSchema";

export async function GetClassById(
  id: string,
  params: {
    page?: number;
    pageSize?: number;
    search?: string;
  } = {},
): Promise<{
  success: boolean;
  data?: {
    id: string;
    name: string;
    students: StudentWithDetails[];
    total: number;
    isNext: boolean;
  };
  message?: string;
  details?: object | null;
}> {
  try {
    const authId = await getUserIdFromCookies();
    if (!authId) return { success: false, message: "Unauthorized" };

    const admin = await prisma.admin.findUnique({ where: { id: authId } });

    let user: User | null = null;
    if (!admin) {
      user = await prisma.user.findUnique({ where: { id: authId } });
      if (!user) return { success: false, message: "Unauthorized" };

      if (user.role !== Role.ADMIN && user.role !== Role.HOD) {
        return { success: false, message: "Forbidden" };
      }
    }

    const validated = validateBody(params, PaginatedSearchParamsSchema.partial());
    const { page = 1, pageSize = 10, search } = validated.data;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const classRecord = await prisma.class.findFirst({
      where: {
        id,
        ...(user?.role === Role.HOD ? { departmentId: user.departmentId } : {}),
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!classRecord) {
      return { success: false, message: "Class not found" };
    }

    const where: Prisma.StudentWhereInput = {
      classId: id,
      ...(user?.role === Role.HOD ? { departmentId: user.departmentId } : {}),
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { rollNo: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phoneNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const total = await prisma.student.count({ where });
    const students = await prisma.student.findMany({
      where,
      include: {
        department: true,
        class: true,
      },
      skip,
      take,
      orderBy: { name: "asc" },
    });

    return {
      success: true,
      data: {
        id: classRecord.id,
        name: classRecord.name,
        students,
        total,
        isNext: total > skip + students.length,
      },
    };
  } catch (error) {
    return handleActionErrorResponse(error);
  }
}
