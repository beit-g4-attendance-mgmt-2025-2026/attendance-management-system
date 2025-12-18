import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";

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
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<main>{children}</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
