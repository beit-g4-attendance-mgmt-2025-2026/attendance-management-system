import { requireAuth } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { CreateSubjectSchema } from "@/lib/schema/CreateSubjectSchema";
import validateBody from "@/lib/validateBody";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ("response" in auth) return auth.response;

    const { user } = auth;
    if (user.role !== "HOD") {
      throw new Error("You are not authorized to create subjects");
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
        departmentId: auth.user.departmentId,
      },
      select: { id: true },
    });

    if (!classRecord) {
      throw new Error("Class not found for your department");
    }

    const subject = await prisma.subject.create({
      data: {
        name: data.name,
        subCode: data.subCode,
        departmentId: auth.user.departmentId,
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
    const auth = await requireAuth(request);
    if ("response" in auth) return auth.response;

    const { user } = auth;
    if (user.role !== "HOD") {
      throw new Error("You are not authorized to view subjects");
    }

    const subjects = await prisma.subject.findMany({
      where: {
        departmentId: user.departmentId,
      },
      include: { department: true, class: true },
    });

    return handleSuccessResponse({ subjects: subjects, status: 200 });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
