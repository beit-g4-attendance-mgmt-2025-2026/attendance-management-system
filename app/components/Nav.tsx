"use client";
import { Mail, MailCheck } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { RoleToggle } from "./role-change";

export default function Nav() {
  const { open } = useSidebar();
  return (
    <div
      className={`fixed top-0 right-0 w-full ${
        open
          ? "md:left-(--sidebar-width) md:w-[80%] "
          : "md:w-[96.4%] md:left-12"
      }  z-50 h-14 px-4 border-b bg-background flex items-center justify-between `}>
      <span className="font-semibold">Attendance System</span>
      <RoleToggle />
      <div className="flex items-center space-x-4">
        <Mail />
        <ModeToggle />
      </div>
    </div>
  );
}
