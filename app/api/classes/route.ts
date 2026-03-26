import { Role } from "@/generated/prisma/client";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { CreateClassSchema } from "@/lib/schema/CreateClassSchema";
import validateBody from "@/lib/validateBody";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminOrUserRoles(request, [Role.HOD, Role.ADMIN]);
    if ("response" in auth) return auth.response;

    const isAdmin = "admin" in auth;
    const authUser = "user" in auth ? auth.user : null;

    if (!isAdmin && !authUser?.departmentId) {
      throw new Error("Department not found");
    }

    const body = await request.json();
    const validatedData = validateBody(body, CreateClassSchema);
    const data = validatedData.data;

    let resolvedDepartmentId = isAdmin
      ? data.departmentId
      : authUser!.departmentId;

    if (data.userId) {
      const teacher = await prisma.user.findFirst({
        where: {
          id: data.userId,
          role: Role.TEACHER,
        },
        select: { id: true, departmentId: true },
      });

      if (!teacher) {
        throw new Error("Assigned class teacher must be a valid teacher");
      }

      if (
        resolvedDepartmentId &&
        teacher.departmentId !== resolvedDepartmentId
      ) {
        throw new Error(
          "Assigned class teacher must belong to the selected department",
        );
      }

      resolvedDepartmentId = teacher.departmentId;
    }

    if (!resolvedDepartmentId) {
      throw new Error("Department is required");
    }

    const department = await prisma.department.findUnique({
      where: { id: resolvedDepartmentId },
      select: { id: true },
    });

    if (!department) {
      throw new Error("Department not found");
    }

    const existingClass = await prisma.class.findFirst({
      where: {
        semester: data.semester,
        year: data.year,
        departmentId: resolvedDepartmentId,
      },
    });

    if (existingClass) {
      throw new Error(
        `A class for ${data.year} ${data.semester} already exists in your department.`,
      );
    }

    const newClass = await prisma.class.create({
      data: {
        name: data.name,
        semester: data.semester,
        year: data.year,
        departmentId: resolvedDepartmentId,
        academicYearId: data.academicYearId,
        userId: data.userId ?? null,
      },
      include: {
        department: true,
        user: true,
        academicYear: true,
      },
    });

    return handleSuccessResponse({ newClass }, 201);
  } catch (error: unknown) {
    return handleErrorResponse(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminOrUserRoles(request, [Role.HOD, Role.ADMIN]);
    if ("response" in auth) return auth.response;

    const isAdmin = "admin" in auth;
    const authUser = "user" in auth ? auth.user : null;

    if (!isAdmin && !authUser?.departmentId) {
      throw new Error("Department not found");
    }

    const classes = await prisma.class.findMany({
      where: isAdmin ? {} : { departmentId: authUser!.departmentId },
      include: { department: true, user: true, academicYear: true },
    });

    return handleSuccessResponse({
      classes,
      status: 200,
    });
  } catch (error: unknown) {
    console.log("Error during get data:", error);
    return handleErrorResponse(error);
  }
}
