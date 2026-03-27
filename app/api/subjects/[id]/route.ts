import { Role } from "@/generated/prisma/client";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { CreateSubjectSchema } from "@/lib/schema/CreateSubjectSchema";
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

    const subject = await prisma.subject.findFirst({
      where: {
        id,
        ...(isAdmin ? {} : { departmentId: authUser.departmentId }),
      },
      include: { department: true, class: true },
    });
    if (!subject) {
      throw new Error("Subject not found!");
    }
    return handleSuccessResponse(subject);
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

    const existingSubject = await prisma.subject.findFirst({
      where: {
        id,
        ...(isAdmin ? {} : { departmentId: authUser.departmentId }),
      },
      select: { id: true },
    });

    if (!existingSubject) {
      throw new Error("Subject not found or unauthorized!");
    }

    const subject = await prisma.subject.delete({
      where: { id },
      include: { department: true, class: true },
    });

    return handleSuccessResponse(subject);
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

    const existingSubject = await prisma.subject.findFirst({
      where: {
        id,
        ...(isAdmin ? {} : { departmentId: authUser.departmentId }),
      },
      select: { id: true, departmentId: true, classId: true, userId: true },
    });

    if (!existingSubject) {
      throw new Error("Subject not found or unauthorized!");
    }

    const body = await request.json();
    const validatedData = CreateSubjectSchema.partial().parse(body);

    let nextDepartmentId = existingSubject.departmentId;
    const nextClassId = validatedData.classId ?? existingSubject.classId;
    const nextUserId = validatedData.userId ?? existingSubject.userId;

    const classRecord = await prisma.class.findFirst({
      where: {
        id: nextClassId,
        ...(isAdmin ? {} : { departmentId: authUser.departmentId }),
      },
      select: { id: true, departmentId: true },
    });

    if (!classRecord) {
      throw new Error(
        isAdmin ? "Class not found" : "Class not found for your department",
      );
    }

    nextDepartmentId = classRecord.departmentId;

    const teacher = await prisma.user.findFirst({
      where: {
        id: nextUserId,
        role: Role.TEACHER,
        departmentId: nextDepartmentId,
      },
      select: { id: true },
    });

    if (!teacher) {
      throw new Error("Assigned teacher must be a teacher in the same department");
    }

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        ...validatedData,
        departmentId: nextDepartmentId,
      },
      include: { department: true, class: true },
    });

    return handleSuccessResponse(subject);
  } catch (e) {
    return handleErrorResponse(e);
  }
}
