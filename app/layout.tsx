import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ProgressBarProvider from "@/components/provider/ProgressBarProvider";

export const metadata: Metadata = {
	title: "Attendance Management System",
	description: "Home Page",
};

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
