import { uploadImageToCloudinary } from "@/lib/cloudinaryUpload";
import { requireAuth } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import validateBody from "@/lib/validateBody";
import { DepartmentSchema } from "@/schema/index.schema";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  //   const auth = await requireAuth(request);
  //     if ("response" in auth) return auth.response;

  try {
    const departments = await prisma.department.findMany({
      include: {
        users: true,
        classes: true,
        students: true,
        subjects: true,
      },
    });

    return handleSuccessResponse({ departments }, 200);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  //   const auth = await requireAuth(request);
  //     if ("response" in auth) return auth.response
  try {
    const form = await request.formData();

    const name = form.get("name") as string;
    const symbol = form.get("symbol") as string;
    const logo = form.get("logo") as File;

    const validated = validateBody({ name, symbol, logo }, DepartmentSchema);
    const {
      name: validatedName,
      symbol: validatedSymbol,
      logo: validatedLogo,
    } = validated.data;

    const existingName = await prisma.department.findFirst({
      where: { name: validatedName },
    });
    if (existingName) throw new Error("Department name already exists");

    const existingSymbol = await prisma.department.findFirst({
      where: { symbol: validatedSymbol },
    });
    if (existingSymbol) throw new Error("Department symbol already exists");

    const uploadResult: any = await uploadImageToCloudinary(
      validatedLogo,
      "departments",
    );
    const imageUrl = uploadResult.secure_url;

    const department = await prisma.department.create({
      data: {
        name: validatedName,
        symbol: validatedSymbol,
        logo: imageUrl,
      },
    });

    return handleSuccessResponse(department, 201);
  } catch (error) {
    return handleErrorResponse(error);
  }
}
