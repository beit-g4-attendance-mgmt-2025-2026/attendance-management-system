import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { CreateStudentSchema } from "@/lib/schema/CreateStudentSchema";
import { NextRequest } from "next/server";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/guard";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const auth = await requireAuth(request);
    if ("response" in auth) {
      return auth.response;
    }

    const { user } = auth;
    if (user.role !== "HOD") {
      throw new Error("You are not authorized to view students");
    }

    const { id } = await params;
    const validatedId = paramsSchema.safeParse(id);
    if (!validatedId) {
      throw new Error("Invalid id format!");
    }

    const isValid = await prisma.student.findFirst({
      where: {
        id,
        departmentId: user.departmentId,
      },
    });

    if (!isValid) {
      throw new Error("Unauthorized");
    }
    const student = await prisma.student.findFirst({
      where: { id: id, departmentId: user.departmentId },
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
    const auth = await requireAuth(request);
    if ("response" in auth) {
      return auth.response;
    }

    const { user } = auth;
    if (user.role !== "HOD") {
      throw new Error("You are not authorized to delete students");
    }

    const { id } = await params;
    const validatedId = paramsSchema.safeParse(id);
    if (!validatedId) {
      throw new Error("Invalid id format!");
    }

    const isValid = await prisma.student.findFirst({
      where: {
        id,
        departmentId: user.departmentId,
      },
    });

    if (!isValid) {
      throw new Error("Unauthorized");
    }
    const student = await prisma.student.deleteMany({
      where: { id: id, departmentId: user.departmentId },
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
    const auth = await requireAuth(request);
    if ("response" in auth) {
      return auth.response;
    }

    const { user } = auth;
    if (user.role !== "HOD") {
      throw new Error("You are not authorized to update students");
    }

    const { id } = await params;
    const validatedId = paramsSchema.safeParse(id);
    if (!validatedId) {
      throw new Error("Invalid id format!");
    }

    const isValid = await prisma.student.findFirst({
      where: {
        id,
        departmentId: user.departmentId,
      },
    });

    if (!isValid) {
      throw new Error("Unauthorized");
    }

    const body = await request.json();
    const validatedData = CreateStudentSchema.partial().parse(body);
    const updateData = {
      ...validatedData,
      ...(validatedData.dateOfBirth !== undefined && {
        dateOfBirth: validatedData.dateOfBirth
          ? new Date(validatedData.dateOfBirth)
          : null,
      }),
    };

    const student = await prisma.student.updateMany({
      where: { id: id, departmentId: user.departmentId },
      data: updateData,
    });

    if (!student) {
      throw new Error("Student not found or unauthorized!");
    }
    return handleSuccessResponse(student);
  } catch (e) {
    return handleErrorResponse(e);
  }
}
