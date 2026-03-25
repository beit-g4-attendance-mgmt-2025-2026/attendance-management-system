"use server";

import { Role, User } from "@/generated/prisma/client";
import { getUserIdFromCookies } from "../jwt";
import { prisma } from "../prisma";
import { handleActionErrorResponse } from "../response";
import { GetStudentsResponse } from "@/types/index.types";

export async function GetStudents(params: any): Promise<GetStudentsResponse> {
  try {
    const { page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;

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

    //  HOD restriction
    if (user?.role === Role.HOD) {
      if (!user.departmentId) {
        return { success: false, message: "HOD has no department" };
      }
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        skip: skip,
        take: pageSize,
        include: { department: true, class: true },
        where: {
          // To Add search/filter later
        },
      }),
      prisma.student.count({}),
    ]);

    const isNext = total > skip + students.length;

    return {
      success: true,
      data: { students: students as any, isNext, total },
    };
  } catch (error) {
    return handleActionErrorResponse(error);
  }
}
