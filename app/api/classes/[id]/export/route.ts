import { Role } from "@/generated/prisma/client";
import {
	buildFullClassDetailsCsv,
	csvResponse,
	toCsvFilename,
} from "@/lib/export/classDetailsCsv";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const auth = await requireAdminOrUserRoles(request, [Role.HOD, Role.ADMIN]);
	if ("response" in auth) return auth.response;

	const user = "user" in auth ? auth.user : null;
	const { id } = await params;

	const classRecord = await prisma.class.findFirst({
		where: {
			id,
			...(user?.role === Role.HOD ? { departmentId: user.departmentId } : {}),
		},
		select: {
			id: true,
			name: true,
			user: {
				select: {
					fullName: true,
				},
			},
		},
	});

	if (!classRecord) {
		return new NextResponse("Class not found", { status: 404 });
	}

	const filenameBase = toCsvFilename(classRecord.name, "class");
	const csv = await buildFullClassDetailsCsv({
		classId: classRecord.id,
		className: classRecord.name,
		familyTeacher: classRecord.user?.fullName,
	});

	return csvResponse(csv, `${filenameBase}-details.csv`);
}
