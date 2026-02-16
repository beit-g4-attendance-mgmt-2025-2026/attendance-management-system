import { requireAuth } from "@/lib/guard";
import { DepartmentSchema } from "@/schema/index.schema";
import validateBody from "@/lib/validateBody";
import { uploadImageToCloudinary } from "@/lib/cloudinaryUpload";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const department = await prisma.department.findUnique({
      where: { id },
      select: {
        name: true,
        symbol: true,
        logo: true,
      },
    });

    if (!department) {
      return handleErrorResponse("Department not found");
    }

    return handleSuccessResponse({ department }, 200);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // const auth = await requireAuth(request, { roles: ["ADMIN"] });
    // if ("response" in auth) return auth.response;

    const form = await request.formData();
    const name = form.get("name") as string | null;
    const symbol = form.get("symbol") as string | null;
    const file = form.get("logo") as File | null;

    const validated = validateBody(
      { name, symbol },
      DepartmentSchema.partial(),
    );

    const dataToUpdate: any = {
      ...validated.data,
    };

    if (file) {
      const uploadResult: any = await uploadImageToCloudinary(
        file,
        "departments",
      );
      dataToUpdate.logo = uploadResult.secure_url;
    }

    if (dataToUpdate.name) {
      const existsName = await prisma.department.findFirst({
        where: { name: dataToUpdate.name, NOT: { id } },
      });
      if (existsName) throw new Error("Department name already exists");
    }

    if (dataToUpdate.symbol) {
      const existsSymbol = await prisma.department.findFirst({
        where: { symbol: dataToUpdate.symbol, NOT: { id } },
      });
      if (existsSymbol) throw new Error("Department symbol already exists");
    }

    const updatedDepartment = await prisma.department.update({
      where: { id },
      data: dataToUpdate,
    });

    return handleSuccessResponse(updatedDepartment);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // const auth = await requireAuth(request, { roles: ["ADMIN"] });
    // if ("response" in auth) return auth.response;

    const userCount = await prisma.user.count({ where: { departmentId: id } });
    const classCount = await prisma.class.count({
      where: { departmentId: id },
    });
    const studentCount = await prisma.student.count({
      where: { departmentId: id },
    });
    const subjectCount = await prisma.subject.count({
      where: { departmentId: id },
    });

    if (userCount > 0)
      throw new Error("Cannot delete department with assigned users");
    if (classCount > 0)
      throw new Error("Cannot delete department with assigned classes");
    if (studentCount > 0)
      throw new Error("Cannot delete department with assigned students");
    if (subjectCount > 0)
      throw new Error("Cannot delete department with assigned subjects");

    await prisma.department.delete({ where: { id } });

    return handleSuccessResponse(
      { message: "Department deleted successfully" },
      200,
    );
  } catch (error) {
    return handleErrorResponse(error);
  }
}
