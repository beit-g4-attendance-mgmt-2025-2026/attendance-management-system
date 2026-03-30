import { Role } from "@/generated/prisma/client";
import {
	buildFullClassDetailsCsv,
	csvResponse,
	toCsvFilename,
} from "@/lib/export/classDetailsCsv";
import { requireAuth } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const auth = await requireAuth(request, {
		roles: [Role.TEACHER, Role.HOD],
	});
	if ("response" in auth) return auth.response;

	const { id } = await params;

	const classRecord = await prisma.class.findFirst({
		where: {
			id,
			userId: auth.user.id,
		},
		select: {
			id: true,
			name: true,
		},
	});

	if (!classRecord) {
		return new NextResponse("Class not found", { status: 404 });
	}

	const filenameBase = toCsvFilename(classRecord.name, "my-class");
	const csv = await buildFullClassDetailsCsv({
		classId: classRecord.id,
		className: classRecord.name,
		familyTeacher: auth.user.fullName,
	});

	return csvResponse(csv, `${filenameBase}-details.csv`);
}
