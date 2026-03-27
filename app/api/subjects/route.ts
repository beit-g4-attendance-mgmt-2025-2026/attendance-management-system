import { Role } from "@/generated/prisma/client";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { CreateSubjectSchema } from "@/lib/schema/CreateSubjectSchema";
import validateBody from "@/lib/validateBody";
import { NextRequest } from "next/server";

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
    const validatedData = validateBody(body, CreateSubjectSchema);
    const data = validatedData.data;

    const existingSubject = await prisma.subject.findFirst({
      where: {
        OR: [{ name: data.name }, { subCode: data.subCode }],
      },
      select: { id: true, name: true, subCode: true },
    });

    if (existingSubject) {
      if (existingSubject.name === data.name) {
        throw new Error("Subject name is already exists");
      }
      if (existingSubject.subCode === data.subCode) {
        throw new Error("Subject code is already exists");
      }
      throw new Error("Subject already exists");
    }

    const classRecord = await prisma.class.findFirst({
      where: {
        id: data.classId,
        ...(isAdmin ? {} : { departmentId: authUser!.departmentId }),
      },
      select: { id: true, departmentId: true },
    });

    if (!classRecord) {
      throw new Error(
        isAdmin ? "Class not found" : "Class not found for your department",
      );
    }

    const teacher = await prisma.user.findFirst({
      where: {
        id: data.userId,
        role: Role.TEACHER,
        departmentId: classRecord.departmentId,
      },
      select: { id: true },
    });

    if (!teacher) {
      throw new Error(
        "Assigned teacher must be a teacher in the same department",
      );
    }

    const subject = await prisma.subject.create({
      data: {
        name: data.name,
        subCode: data.subCode,
        departmentId: classRecord.departmentId,
        userId: data.userId,
        classId: data.classId,
      },
      include: {
        department: true,
        class: true,
      },
    });

    return handleSuccessResponse({ subject }, 201);
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

    const subjects = await prisma.subject.findMany({
      where: isAdmin ? {} : { departmentId: authUser!.departmentId },
      include: { department: true, class: true },
    });

    return handleSuccessResponse({ subjects, status: 200 });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
