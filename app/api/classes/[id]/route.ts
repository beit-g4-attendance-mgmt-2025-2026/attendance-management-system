import { Role } from "@/generated/prisma/client";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { CreateClassSchema } from "@/lib/schema/CreateClassSchema";
import validateBody from "@/lib/validateBody";
import type { NextRequest } from "next/server";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.string().uuid("Invalid class id format"),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdminOrUserRoles(request, [Role.HOD, Role.ADMIN]);
    if ("response" in auth) return auth.response;

    const isAdmin = "admin" in auth;
    const authUser = "user" in auth ? auth.user : null;
    if (!isAdmin && !authUser?.departmentId) {
      throw new Error("Department not found");
    }

    const { id } = await params;
    const validatedParams = paramsSchema.safeParse({ id });
    if (!validatedParams.success) {
      throw new Error("Invalid class id format");
    }

    const classRecord = await prisma.class.findFirst({
      where: {
        id,
        ...(isAdmin ? {} : { departmentId: authUser.departmentId }),
      },
      include: {
        department: true,
        user: true,
        academicYear: true,
        students: true,
        subjects: true,
      },
    });

    if (!classRecord) {
      throw new Error("Class not found or unauthorized!");
    }

    return handleSuccessResponse(classRecord);
  } catch (error: unknown) {
    return handleErrorResponse(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdminOrUserRoles(request, [Role.HOD, Role.ADMIN]);
    if ("response" in auth) return auth.response;

    const isAdmin = "admin" in auth;
    const authUser = "user" in auth ? auth.user : null;
    if (!isAdmin && !authUser?.departmentId) {
      throw new Error("Department not found");
    }

    const { id } = await params;
    const validatedParams = paramsSchema.safeParse({ id });
    if (!validatedParams.success) {
      throw new Error("Invalid class id format");
    }

    const existingClass = await prisma.class.findFirst({
      where: {
        id,
        ...(isAdmin ? {} : { departmentId: authUser.departmentId }),
      },
      select: {
        id: true,
        year: true,
        semester: true,
        academicYearId: true,
        departmentId: true,
      },
    });

    if (!existingClass) {
      throw new Error("Class not found or unauthorized!");
    }

    const body = await request.json();
    const validatedData = validateBody(body, CreateClassSchema, true);
    const data = validatedData.data;

    let nextDepartmentId = isAdmin
      ? data.departmentId ?? existingClass.departmentId
      : authUser.departmentId;

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

      if (teacher.departmentId !== nextDepartmentId) {
        throw new Error("Assigned class teacher must belong to the selected department");
      }
    }

    const department = await prisma.department.findUnique({
      where: { id: nextDepartmentId },
      select: { id: true },
    });

    if (!department) {
      throw new Error("Department not found");
    }

    if (data.academicYearId) {
      const academicYear = await prisma.academicYear.findUnique({
        where: { id: data.academicYearId },
        select: { id: true },
      });

      if (!academicYear) {
        throw new Error("Academic year not found");
      }
    }

    const nextYear = data.year ?? existingClass.year;
    const nextSemester = data.semester ?? existingClass.semester;

    const duplicateClass = await prisma.class.findFirst({
      where: {
        id: { not: id },
        departmentId: nextDepartmentId,
        year: nextYear,
        semester: nextSemester,
      },
      select: { id: true },
    });

    if (duplicateClass) {
      throw new Error(
        `A class for ${nextYear} ${nextSemester} already exists in your department.`,
      );
    }

    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        ...data,
        departmentId: nextDepartmentId,
      },
      include: {
        department: true,
        user: true,
        academicYear: true,
      },
    });

    return handleSuccessResponse({ class: updatedClass });
  } catch (error: unknown) {
    return handleErrorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdminOrUserRoles(request, [Role.HOD, Role.ADMIN]);
    if ("response" in auth) return auth.response;

    const isAdmin = "admin" in auth;
    const authUser = "user" in auth ? auth.user : null;
    if (!isAdmin && !authUser?.departmentId) {
      throw new Error("Department not found");
    }

    const { id } = await params;
    const validatedParams = paramsSchema.safeParse({ id });
    if (!validatedParams.success) {
      throw new Error("Invalid class id format");
    }

    const classRecord = await prisma.class.findFirst({
      where: {
        id,
        ...(isAdmin ? {} : { departmentId: authUser.departmentId }),
      },
      select: {
        id: true,
        _count: {
          select: {
            students: true,
            subjects: true,
          },
        },
      },
    });

    if (!classRecord) {
      throw new Error("Class not found or unauthorized!");
    }

    if (classRecord._count.students > 0 || classRecord._count.subjects > 0) {
      throw new Error(
        "Cannot delete class while students or subjects are still assigned to it",
      );
    }

    const deletedClass = await prisma.class.delete({
      where: { id },
      include: {
        department: true,
        academicYear: true,
      },
    });

    return handleSuccessResponse({ class: deletedClass });
  } catch (error: unknown) {
    return handleErrorResponse(error);
  }
}
