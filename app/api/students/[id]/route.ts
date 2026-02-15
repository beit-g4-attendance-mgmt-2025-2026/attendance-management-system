import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import validateBody from "@/lib/validateBody";
import { CreateStudentSchema } from "@/lib/schema/CreateStudentSchema";
import { NextRequest } from "next/server";
import z from "zod";
import { prisma } from "@/lib/prisma";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const validatedId = paramsSchema.safeParse(id);
    if (!validatedId) {
      throw new Error("Invalid id format!");
    }
    const student = await prisma.student.findUnique({
      where: { id: id },
      include: { department: true, class: true },
    });
    if (!student) {
      throw new Error("Student not found!");
    }
    return handleSuccessResponse(student);
  } catch (e) {
    return handleErrorResponse(e);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const validatedId = paramsSchema.safeParse(id);
    if (!validatedId) {
      throw new Error("Invalid id format!");
    }
    const student = await prisma.student.delete({
      where: { id: id },
      include: { department: true, class: true },
    });

    if (!student) {
      throw new Error("Student not found!");
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
    const { id } = await params;
    const validatedId = paramsSchema.safeParse(id);
    if (!validatedId) {
      throw new Error("Invalid id format!");
    }

    const body = await request.json();
    const validatedData = CreateStudentSchema.partial().parse(body);

    const student = await prisma.student.update({
      where: { id: id },
      data: validatedData,
      include: { department: true, class: true },
    });

    if (!student) {
      throw new Error("Student not found!");
    }
    return handleSuccessResponse(student);
  } catch (e) {
    return handleErrorResponse(e);
  }
}
