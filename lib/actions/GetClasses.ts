"use server";

import { Prisma, Role, Semester, User, Year } from "@/generated/prisma/client";
import { ClassCardItem, GetClassesResponse } from "@/types/index.types";
import { getUserIdFromCookies } from "../jwt";
import { prisma } from "../prisma";
import { handleActionErrorResponse } from "../response";
import validateBody from "../validateBody";
import PaginatedSearchParamsSchema from "../schema/PaginatedSearchParamsSchema";

export async function GetClasses(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string;
}): Promise<GetClassesResponse> {
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
    const { page = 1, pageSize = 10, search, filter } = validated.data;

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const where: Prisma.ClassWhereInput = {};

    if (search) {
      const searchFilters: Prisma.ClassWhereInput[] = [
        { name: { contains: search, mode: "insensitive" } },
        { department: { name: { contains: search, mode: "insensitive" } } },
      ];

      if ((Object.values(Year) as string[]).includes(search)) {
        searchFilters.push({ year: { equals: search as Year } });
      }

      if ((Object.values(Semester) as string[]).includes(search)) {
        searchFilters.push({ semester: { equals: search as Semester } });
      }

      where.OR = searchFilters;
    }

    if (filter) {
      where.department = { symbol: filter };
    }

    //  HOD restriction
    if (user?.role === Role.HOD) {
      if (!user.departmentId) {
        return { success: false, message: "HOD has no department" };
      }
      where.departmentId = user.departmentId;
    }

    const total = await prisma.class.count({ where });

    const classes = await prisma.class.findMany({
      where,
      include: { department: true, user: true, students: true },
      skip,
      take,
      orderBy: { name: "asc" },
    });

    const isNext = total > skip + classes.length;

    const mappedClasses: ClassCardItem[] = classes.map((cls) => {
      const male = cls.students.filter(
        (students) => students.gender === "MALE",
      ).length;
      const female = cls.students.filter(
        (students) => students.gender === "FEMALE",
      ).length;
      const total = cls.students.length;

      return {
        id: cls.id,
        name: cls.name,
        familyTeacher: cls.user?.fullName ?? "Not assigned",
        male,
        female,
        total,
      };
    });

    return {
      success: true,
      data: { classes: mappedClasses, total, isNext },
    };
  } catch (error) {
    return handleActionErrorResponse(error);
  }
}
