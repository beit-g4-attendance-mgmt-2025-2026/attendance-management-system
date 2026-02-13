import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public pages and API prefixes that don't require authentication
const PUBLIC_PAGES = ["/login", "/register"];
const PUBLIC_API_PREFIXES = ["/api/auth"];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get("token")?.value;

	// for login, register and auth api request
	if (pathname.startsWith("/api")) {
		if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
			return NextResponse.next();
		}

		if (!token) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}
		return NextResponse.next();
	}

	// for frontend page request
	const isPublicPage = PUBLIC_PAGES.includes(pathname);

	// not token and not public page -> redirect to login
	if (!token && !isPublicPage) {
		const loginUrl = new URL("/login", request.url);
		return NextResponse.redirect(loginUrl);
	}

	if (token && isPublicPage) {
		const dashboardUrl = new URL("/dashboard", request.url);
		return NextResponse.redirect(dashboardUrl);
	}

	return NextResponse.next();
}

/*
	 * left  static files (images, css, favicon) and
	 *pass all other requests through the middleware

	 */
export const config = {
	matcher: ["/((?!api|_next|.*\\..*).*)"],
};
