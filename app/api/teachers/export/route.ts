import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminOrUserRoles } from "@/lib/guard";
import { forbidden } from "@/lib/response";
import { Role, type Prisma } from "@/generated/prisma/client";

function csvEscape(value: unknown) {
	const s = value == null ? "" : String(value);
	const escaped = s.replace(/"/g, `""`);
	return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

export async function GET(request: NextRequest) {
	const auth = await requireAdminOrUserRoles(request, [Role.HOD, Role.ADMIN]);
	if ("response" in auth) return auth.response;

	const { searchParams } = new URL(request.url);

	const search = searchParams.get("search")?.trim() || "";
	const filter = searchParams.get("filter") || "";

	const where: Prisma.UserWhereInput = {};

	if (search) {
		where.OR = [
			{ fullName: { contains: search, mode: "insensitive" } },
			{ username: { contains: search, mode: "insensitive" } },
			{ email: { contains: search, mode: "insensitive" } },
			{ phoneNumber: { contains: search, mode: "insensitive" } },
		];
	}

	if (filter) {
		where.department = { symbol: filter };
	}

	// HOD can only export their department
	if ("user" in auth && auth.user.role === Role.HOD) {
		if (!auth.user.departmentId) {
			return forbidden("HOD has no department");
		}
		where.departmentId = auth.user.departmentId;
	}

	const users = await prisma.user.findMany({
		where,
		select: {
			fullName: true,
			username: true,
			email: true,
			gender: true,
			role: true,
			phoneNumber: true,
			createdAt: true,
			department: {
				select: {
					symbol: true,
					name: true,
				},
			},
		},
	});

	const header = [
		"Full Name",
		"Username",
		"Email",
		"Gender",
		"Role",
		"Phone",
		"Department Symbol",
		"Department Name",
		"CreatedAt",
	];

	const rows = users.map((u) => [
		csvEscape(u.fullName),
		csvEscape(u.username),
		csvEscape(u.email),
		csvEscape(u.gender),
		csvEscape(u.role),
		csvEscape(u.phoneNumber),
		csvEscape(u.department?.symbol ?? ""),
		csvEscape(u.department?.name ?? ""),
		csvEscape(u.createdAt),
	]);

	const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");

	return new NextResponse("\ufeff" + csv, {
		status: 200,
		headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition": `attachment; filename="teachers.csv"`,
		},
	});
}
