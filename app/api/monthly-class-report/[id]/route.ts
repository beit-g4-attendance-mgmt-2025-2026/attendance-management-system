import { Month } from "@/generated/prisma/client";
import { GetMonthlyClassReport } from "@/lib/actions/GetMonthlyClassReport.actions";
import { handleErrorResponse, handleSuccessResponse } from "@/lib/response";
import type { NextRequest } from "next/server";
import { z } from "zod";

const paramsSchema = z.object({
	id: z.string().uuid("Invalid class id format"),
});

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const validatedParams = paramsSchema.parse({ id });
		const rawMonth = new URL(request.url).searchParams.get("month");
		const fallbackMonth = Object.values(Month)[new Date().getMonth()];
		const month =
			rawMonth && Object.values(Month).includes(rawMonth as Month)
				? (rawMonth as Month)
				: fallbackMonth;

		const result = await GetMonthlyClassReport({
			classId: validatedParams.id,
			month,
		});

		if (!result.success) {
			throw new Error(result.message ?? "Unable to load monthly class report");
		}

		return handleSuccessResponse(result.data);
	} catch (error: unknown) {
		return handleErrorResponse(error);
	}
}
