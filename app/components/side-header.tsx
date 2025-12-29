"use client";
import Image from "next/image";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { useState } from "react";

export default function Header() {
  const { open } = useSidebar();
  const [hover, setHover] = useState(false);

  return (
    <div className="flex justify-between ps-2 p-4 border-b h-14">
      <span
        className="flex items-center w-10 justify-center"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}>
        {/* Sidebar CLOSED */}
        {!open && !hover && (
          <Image src="/TU_logo.jpg" alt="logo" width={24} height={24} />
        )}

        {!open && hover && <SidebarTrigger />}

        {open && <Image src="/TU_logo.jpg" alt="logo" width={24} height={24} />}
      </span>

      {open && <SidebarTrigger />}
    </div>
  );
}
