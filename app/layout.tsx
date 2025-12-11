import type { Metadata } from "next";

// @ts-expect-error - allow importing global CSS without type declarations
import "./globals.css";

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
		<html lang="en">
			<body className={` antialiased`}>
				<main>{children}</main>
			</body>
		</html>
	);
}
