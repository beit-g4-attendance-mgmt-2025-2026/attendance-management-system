import { Role } from "@/generated/prisma/enums";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { CreateStudentSchema } from "@/lib/schema/CreateStudentSchema";
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
    const validatedData = validateBody(body, CreateStudentSchema);
    const data = validatedData.data;

    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [{ email: data.email }, { rollNo: data.rollNo }],
      },
      select: { id: true, email: true, rollNo: true },
    });

    if (existingStudent) {
      if (existingStudent.email === data.email) {
        throw new Error("Student email already exists");
      }
      if (existingStudent.rollNo === data.rollNo) {
        throw new Error("Student roll number already exists");
      }
      throw new Error("Student already exists");
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

    const student = await prisma.student.create({
      data: {
        name: data.name,
        rollNo: data.rollNo,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        email: data.email,
        year: data.year,
        semester: data.semester,
        departmentId: classRecord.departmentId,
        classId: data.classId,
      },
      include: {
        department: true,
        class: true,
      },
    });

    return handleSuccessResponse({ student }, 201);
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

    const students = await prisma.student.findMany({
      where: isAdmin ? {} : { departmentId: authUser!.departmentId },
      orderBy: [{ name: "asc" }],
      include: { department: true, class: true },
    });

    return handleSuccessResponse({
      students,
      status: 200,
    });
  } catch (error: unknown) {
    console.log("Error during get data:", error);
    return handleErrorResponse(error);
  }
}
