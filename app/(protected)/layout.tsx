"use client";
import React, { useEffect, useState } from "react";
import ClientProtected from "./ClientProtected";
import { useTheme } from "next-themes";
import Nav from "@/components/Nav";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ClientProtected>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Nav />
          <main className="flex-1 min-h-screen  p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ClientProtected>
  );
}
