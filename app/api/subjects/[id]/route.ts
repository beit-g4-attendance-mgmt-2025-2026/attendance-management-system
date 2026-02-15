import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { NextRequest } from "next/server";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/guard";
import { CreateSubjectSchema } from "@/lib/schema/CreateSubjectSchema";

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
      throw new Error("You are not authorized to view subjects");
    }
    const { id } = await params;
    const validatedId = paramsSchema.safeParse(id);
    if (!validatedId) {
      throw new Error("Invalid id format!");
    }

    const isValid = await prisma.subject.findFirst({
      where: {
        id,
        departmentId: user.departmentId,
      },
    });

    if (!isValid) {
      throw new Error("Unauthorized");
    }

    const subject = await prisma.subject.findUnique({
      where: { id: id, departmentId: user.departmentId },
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
    const auth = await requireAuth(request);
    if ("response" in auth) {
      return auth.response;
    }

    const { user } = auth;
    if (user.role !== "HOD") {
      throw new Error("You are not authorized to delete subjects");
    }
    const { id } = await params;
    const validatedId = paramsSchema.safeParse(id);
    if (!validatedId) {
      throw new Error("Invalid id format!");
    }

    const isValid = await prisma.subject.findFirst({
      where: {
        id,
        departmentId: user.departmentId,
      },
    });

    if (!isValid) {
      throw new Error("Unauthorized");
    }

    const subject = await prisma.subject.delete({
      where: { id: id, departmentId: user.departmentId },
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
      throw new Error("You are not authorized to update subjects");
    }

    const { id } = await params;
    const validatedId = paramsSchema.safeParse(id);
    if (!validatedId) {
      throw new Error("Invalid id format!");
    }

    const isValid = await prisma.subject.findFirst({
      where: {
        id,
        departmentId: user.departmentId,
      },
    });

    if (!isValid) {
      throw new Error("Unauthorized");
    }

    const body = await request.json();
    const validatedData = CreateSubjectSchema.partial().parse(body);

    const subject = await prisma.subject.update({
      where: { id: id, departmentId: user.departmentId },
      data: validatedData,
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
