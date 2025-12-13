"use client";
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
          <img
            src="https://tumeiktila.edu.mm/wp-content/uploads/2020/01/TU_logo.jpg"
            alt=""
            className="w-6 h-8"
          />
        )}

        {!open && hover && <SidebarTrigger />}

        {open && (
          <img
            src="https://tumeiktila.edu.mm/wp-content/uploads/2020/01/TU_logo.jpg"
            alt=""
            className="w-6 h-8"
          />
        )}
      </span>

      {open && <SidebarTrigger />}
    </div>
  );
}
