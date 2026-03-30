"use server";

import { Prisma, Role, Semester, User, Year } from "@/generated/prisma/client";
import { getUserIdFromCookies } from "../jwt";
import { prisma } from "../prisma";
import { handleActionErrorResponse } from "../response";
import { GetStudentsResponse } from "@/types/index.types";
import validateBody from "../validateBody";
import PaginatedSearchParamsSchema from "../schema/PaginatedSearchParamsSchema";

export async function GetStudents(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string;
  year?: string;
  semester?: string;
}): Promise<GetStudentsResponse> {
  try {
    // Auth from cookies (Admin OR User)
    const authId = await getUserIdFromCookies();
    if (!authId) return { success: false, message: "Unauthorized" };

    // check Admin table first
    const admin = await prisma.admin.findUnique({ where: { id: authId } });

    // if not admin, check User table
    let user: User | null = null;
    if (!admin) {
      user = await prisma.user.findUnique({ where: { id: authId } });
      if (!user) return { success: false, message: "Unauthorized" };

      if (user.role !== Role.ADMIN && user.role !== Role.HOD) {
        return { success: false, message: "Forbidden" };
      }
    }

    const validated = validateBody(params, PaginatedSearchParamsSchema);
    const { page = 1, pageSize = 10, search, filter, year, semester } =
      validated.data;

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const where: Prisma.StudentWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { rollNo: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phoneNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    if (filter) {
      where.department = { symbol: filter };
    }

    if (year && Object.values(Year).includes(year as Year)) {
      where.year = year as Year;
    }

    if (
      semester &&
      Object.values(Semester).includes(semester as Semester)
    ) {
      where.semester = semester as Semester;
    }

    //  HOD restriction
    if (user?.role === Role.HOD) {
      if (!user.departmentId) {
        return { success: false, message: "HOD has no department" };
      }
      where.departmentId = user.departmentId;
    }

    const total = await prisma.student.count({ where });

    const students = await prisma.student.findMany({
      where,
      include: { department: true, class: true },
      skip,
      take,
      orderBy: { name: "asc" },
    });

    const isNext = total > skip + students.length;

    return {
      success: true,
      data: { students, total, isNext },
    };
  } catch (error) {
    return handleActionErrorResponse(error);
  }
}
