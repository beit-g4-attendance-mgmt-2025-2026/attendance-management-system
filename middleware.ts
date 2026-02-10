import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_API_PREFIXES = ["/api/auth"];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
		return NextResponse.next();
	}

	const token = request.cookies.get("token")?.value;
	if (token) return NextResponse.next();

	if (pathname.startsWith("/api")) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const loginUrl = new URL("/login", request.url);
	return NextResponse.redirect(loginUrl);
}

export const config = {
	matcher: ["/api/:path*", "/dashboard/:path*"],
};
