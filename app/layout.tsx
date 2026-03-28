import type { Metadata } from "next";
import { headers } from "next/headers";

import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ProgressBarProvider from "@/components/provider/ProgressBarProvider";

const APP_NAME = "Attendance Management System";

const prettifySegment = (segment: string) => {
	const isUUID =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
			segment,
		);

	if (isUUID || /^\d+$/.test(segment)) return "Detail";

	return segment
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

const titleFromPath = (pathname: string) => {
	if (!pathname || pathname === "/") return "Home";

	const parts = pathname.split("/").filter(Boolean).map(prettifySegment);
	return parts.join(" - ");
};

export async function generateMetadata(): Promise<Metadata> {
	const headerStore = await headers();
	const pathname = headerStore.get("x-pathname") ?? "/";
	const pageTitle = titleFromPath(pathname);

	return {
		title: `${pageTitle} | ${APP_NAME}`,
		description: `${pageTitle} page`,
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={` antialiased`} cz-shortcut-listen="true">
				<ProgressBarProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<main className="dark:bg-[#0B1120]">{children}</main>
						<Toaster />
					</ThemeProvider>
				</ProgressBarProvider>
			</body>
		</html>
	);
}
