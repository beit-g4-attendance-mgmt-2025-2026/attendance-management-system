"use client";
import React, { useEffect, useState } from "react";
import ClientProtected from "./ClientProtected";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";

import Nav from "../../components/Nav";
import { useTheme } from "next-themes";
import { AppSidebar } from "@/components/app-sidebar";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { theme, systemTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const currentTheme = theme === "system" ? systemTheme : theme;

	return (
		<ClientProtected>
			<SidebarProvider>
				<AppSidebar />

				<SidebarInset>
					<Nav />
					<div
						className={`${
							currentTheme === "light"
								? "bg-stone-200"
								: "primary-foreground"
						} p-4 pt-18`}
					>
						<main
							className={`flex-1 min-h-screen rounded-xl p-4 ${
								currentTheme === "light"
									? "bg-white"
									: "bg-[#0B1120]"
							}`}
						>
							{children}
						</main>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</ClientProtected>
	);
}
