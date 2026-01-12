import { MdOutlineDashboard } from "react-icons/md";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { PiStudentFill } from "react-icons/pi";
import { FaWarehouse } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Header from "./side-header";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: MdOutlineDashboard,
  },
  {
    title: "Department",
    url: "/departments",
    icon: FaWarehouse,
  },
  {
    title: "Teacher",
    url: "/teacher-list",
    icon: PiChalkboardTeacherFill,
  },
  {
    title: "Students",
    url: "/student-list",
    icon: PiStudentFill,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: IoMdSettings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  console.log("Current Pathname:", pathname);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="text-white">
        {/* HEADER */}
        <Header />

        {/* MENU */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={`link ${
                      pathname === item.url ? "bg-sidebar-primary" : ""
                    }`}
                    tooltip={item.title}
                    asChild>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
