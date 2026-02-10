import { NextResponse } from "next/server";
import { ZodError } from "zod";

const handleSuccessResponse = (data: unknown, status: number = 200) => {
	return NextResponse.json({ data, success: true }, { status });
};

const handleErrorResponse = (err: unknown) => {
	let status = 500;
	let message = err instanceof Error ? err.message : "Internal Server Error";
	let details = null;
	//handle validation error with zod
	if (err instanceof ZodError) {
		details = err.flatten().fieldErrors;
		status = 400;
		message = "Validation Error";
	}
	return NextResponse.json(
		{
			message,
			success: false,
			details,
			status,
		},
		{ status },
	);
};
const handleActionErrorResponse = (err: unknown) => {
	let message = err instanceof Error ? err.message : "Internal Server Error";
	let details = null;
	//handle validation error with zod
	if (err instanceof ZodError) {
		details = err.flatten().fieldErrors;
		message = "Validation Error";
	}
	return {
		message,
		success: false,
		details,
	};
};
const unauthorized = (message = "Unauthorized") => {
	return NextResponse.json({ error: message }, { status: 401 });
};
const forbidden = (message = "Forbidden") => {
	return NextResponse.json({ error: message }, { status: 403 });
};

export {
	handleSuccessResponse,
	handleErrorResponse,
	handleActionErrorResponse,
	unauthorized,
	forbidden,
};
