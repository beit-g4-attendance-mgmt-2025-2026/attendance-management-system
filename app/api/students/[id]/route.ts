import { Role } from "@/generated/prisma/enums";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { CreateStudentSchema } from "@/lib/schema/CreateStudentSchema";
import { NextRequest } from "next/server";
import z from "zod";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const auth = await requireAdminOrUserRoles(request, [Role.HOD, Role.ADMIN]);
    if ("response" in auth) {
      return auth.response;
    }

    const isAdmin = "admin" in auth;
    const authUser = "user" in auth ? auth.user : null;
    if (!isAdmin && !authUser?.departmentId) {
      throw new Error("Department not found");
    }

    const { id } = await params;
    const validatedId = paramsSchema.safeParse({ id });
    if (!validatedId.success) {
      throw new Error("Invalid id format!");
    }

    const student = await prisma.student.findFirst({
      where: {
        id,
        ...(isAdmin ? {} : { departmentId: authUser!.departmentId }),
      },
      include: { department: true, class: true },
    });

    if (!student) {
      throw new Error("Student not found or unauthorized!");
    }
    return handleSuccessResponse(student);
  } catch (e) {
    return handleErrorResponse(e);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const auth = await requireAdminOrUserRoles(request, [Role.HOD, Role.ADMIN]);
    if ("response" in auth) {
      return auth.response;
    }

    const isAdmin = "admin" in auth;
    const authUser = "user" in auth ? auth.user : null;
    if (!isAdmin && !authUser?.departmentId) {
      throw new Error("Department not found");
    }

    const { id } = await params;
    const validatedId = paramsSchema.safeParse({ id });
    if (!validatedId.success) {
      throw new Error("Invalid id format!");
    }

    const student = await prisma.student.deleteMany({
      where: {
        id,
        ...(isAdmin ? {} : { departmentId: authUser!.departmentId }),
      },
    });

    if (!student.count) {
      throw new Error("Student not found or unauthorized!");
    }
    return handleSuccessResponse(student);
  } catch (e) {
    return handleErrorResponse(e);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const auth = await requireAdminOrUserRoles(request, [Role.HOD, Role.ADMIN]);
    if ("response" in auth) {
      return auth.response;
    }

    const isAdmin = "admin" in auth;
    const authUser = "user" in auth ? auth.user : null;
    if (!isAdmin && !authUser?.departmentId) {
      throw new Error("Department not found");
    }

    const { id } = await params;
    const validatedId = paramsSchema.safeParse({ id });
    if (!validatedId.success) {
      throw new Error("Invalid id format!");
    }

    const existingStudent = await prisma.student.findFirst({
      where: {
        id,
        ...(isAdmin ? {} : { departmentId: authUser!.departmentId }),
      },
      select: { id: true, departmentId: true },
    });

    if (!existingStudent) {
      throw new Error("Student not found or unauthorized!");
    }

    const body = await request.json();
    const validatedData = CreateStudentSchema.partial().parse(body);

    let nextDepartmentId = existingStudent.departmentId;
    if (validatedData.classId) {
      const classRecord = await prisma.class.findFirst({
        where: {
          id: validatedData.classId,
          ...(isAdmin ? {} : { departmentId: authUser!.departmentId }),
        },
        select: { id: true, departmentId: true },
      });

      if (!classRecord) {
        throw new Error(
          isAdmin ? "Class not found" : "Class not found for your department",
        );
      }

      nextDepartmentId = classRecord.departmentId;
    }

    const updateData = {
      ...validatedData,
      departmentId: nextDepartmentId,
      ...(validatedData.dateOfBirth !== undefined && {
        dateOfBirth: validatedData.dateOfBirth
          ? new Date(validatedData.dateOfBirth)
          : null,
      }),
    };

    const student = await prisma.student.update({
      where: { id },
      data: updateData,
      include: { department: true, class: true },
    });

    return handleSuccessResponse(student);
  } catch (e) {
    return handleErrorResponse(e);
  }
}
