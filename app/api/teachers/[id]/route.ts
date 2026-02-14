import { requireAuth } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import UserEditSchema from "@/lib/schema/TeacherEditSchema";
import { toPublicUser } from "@/lib/user";
import validateBody from "@/lib/validateBody";
import { NextRequest } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	// const auth = await requireAuth(request);
	// if ("response" in auth) return auth.response;
	// const authUser = auth.user;
	// const isAdmin = authUser.role === "ADMIN";
	// const isSelf = authUser.id === params.id;
	// if (!isAdmin && !isSelf)
	// 	return handleErrorResponse("Access denied! Please contact admin.");

	const user = await prisma.user.findUnique({
		where: { id: params.id },
		include: { department: true, class: true, subjects: true },
	});
	if (!user) return handleErrorResponse("User not found");
	return handleSuccessResponse({ user: toPublicUser(user) });
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		// const auth = await requireAuth(request, {
		// 	roles: ["ADMIN", "HOD"],
		// });

		// if ("response" in auth) return auth.response;

		const { id } = params;

		const body = await request.json();
		const validatedData = validateBody(body, UserEditSchema);
		const data = validatedData.data;

		const user = await prisma.user.update({
			where: {
				id: id,
			},
			data: {
				...data,
				department: data.departmentId
					? {
							connect: { id: data.departmentId },
						}
					: undefined,
			},
		});
		if (!user) throw new Error("User not found");

		return handleSuccessResponse(toPublicUser(user));
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

		const auth = await requireAuth(request, { roles: ["ADMIN", "HOD"] });
		if ("response" in auth) return auth.response;

		// const authUser = auth.user;
		// const isAdmin = authUser.role === "ADMIN";
		// const isSelf = authUser.id === id;
		// if (!isAdmin && !isSelf)
		// 	throw new Error("Access denied! Please contact admin.");

		const user = await prisma.user.delete({ where: { id: id } });
		if (!user) throw new Error("User not found");

		return handleSuccessResponse(toPublicUser(user));
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}
