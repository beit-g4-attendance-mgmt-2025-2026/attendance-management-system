import { MdOutlineDashboard } from "react-icons/md";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { PiStudentFill } from "react-icons/pi";
import { FaWarehouse } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { BsBook } from "react-icons/bs";
import { SiGoogleclassroom } from "react-icons/si";
import { LuBook } from "react-icons/lu";
import { TbReportAnalytics } from "react-icons/tb";

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

import Cookies from "js-cookie";

type SidebarItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};

type Role = "admin" | "department" | "teacher";

export function AppSidebar() {
  const pathname = usePathname();
  const role: Role = Cookies.get("role") as Role;

  const sidebarItemsByRole: Record<Role, SidebarItem[]> = {
    admin: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: MdOutlineDashboard,
      },
      {
        title: "Departments",
        url: "/departments",
        icon: FaWarehouse,
      },
      {
        title: "Teacher",
        url: "/teachers",
        icon: PiChalkboardTeacherFill,
      },
      {
        title: "Students",
        url: "/students",
        icon: PiStudentFill,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: IoMdSettings,
      },
    ],
    department: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: MdOutlineDashboard,
      },
      {
        title: "Teacher",
        url: "/teachers",
        icon: PiChalkboardTeacherFill,
      },
      {
        title: "Students",
        url: "/students",
        icon: PiStudentFill,
      },
      {
        title: "Classes",
        url: "/classes",
        icon: SiGoogleclassroom,
      },
      {
        title: "Subjects",
        url: "/subjects",
        icon: BsBook,
      },
      {
        title: "Report",
        url: "/manage-reports",
        icon: TbReportAnalytics,
      },
      {
        title: "My Class",
        url: "/my-class",
        icon: SiGoogleclassroom,
      },
      {
        title: "My Subjects",
        url: "/my-subjects",
        icon: LuBook,
      },
    ],
    teacher: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: MdOutlineDashboard,
      },
      {
        title: "My Class",
        url: "/my-class",
        icon: SiGoogleclassroom,
      },
      {
        title: "My Subjects",
        url: "/my-subjects",
        icon: LuBook,
      },
    ],
  };
  const items = sidebarItemsByRole[role];
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="text-white">
        {/* HEADER */}
        <Header />

        {/* MENU */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2">
              {items &&
                items.map((item) => (
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
