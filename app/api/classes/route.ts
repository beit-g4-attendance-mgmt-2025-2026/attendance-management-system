import { requireAuth } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { CreateClassSchema } from "@/lib/schema/CreateClassSchema";
import validateBody from "@/lib/validateBody";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ("response" in auth) return auth.response;

    const { user } = auth;
    if (user.role !== "HOD") {
      throw new Error("You are not authorized to create classes");
    }

    const body = await request.json();
    const validatedData = validateBody(body, CreateClassSchema);
    const data = validatedData.data;

    if (data.userId) {
      const teacher = await prisma.user.findFirst({
        where: {
          id: data.userId,
          departmentId: user.departmentId,
          role: "TEACHER",
        },
        select: { id: true },
      });

      if (!teacher) {
        throw new Error("Assigned class teacher must be a teacher in your department");
      }
    }

    const existingClass = await prisma.class.findFirst({
      where: {
        semester: data.semester,
        year: data.year,
        departmentId: user.departmentId,
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
        departmentId: user.departmentId,
        academicYearId: data?.academicYearId,
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
    const auth = await requireAuth(request);
    if ("response" in auth) return auth.response;

    const { user } = auth;
    if (user.role !== "HOD") {
      throw new Error("You are not authorized to view classes");
    }

    const classes = await prisma.class.findMany({
      where: { departmentId: user.departmentId },
      include: { department: true, user: true, academicYear: true },
    });

    return handleSuccessResponse({
      classes: classes,
      status: 200,
    });
  } catch (error: unknown) {
    console.log("Error during get data:", error);
    return handleErrorResponse(error);
  }
}
