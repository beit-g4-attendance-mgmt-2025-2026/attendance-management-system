import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const admin = await prisma.admin.findUnique({
			where: { id: params.id },
		});
		if (!admin) throw new Error("Admin not found");

		return handleSuccessResponse(admin, 200);
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { id } = params;

		// const auth = await requireAuth(request, { roles: ["ADMIN"] });
		// if ("response" in auth) return auth.response;

		const admin = await prisma.admin.delete({ where: { id: id } });

		if (!admin) throw new Error("Admin not found");

		return handleSuccessResponse(admin);
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}
