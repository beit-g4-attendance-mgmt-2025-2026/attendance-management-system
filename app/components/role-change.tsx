"use client";

import * as React from "react";
import Cookies from "js-cookie";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function RoleToggle() {
  const [role, setRole] = React.useState<string>(Cookies.get("role") || "");

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    Cookies.set("role", newRole, { expires: 7 }); // expires in 7 days
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">
          {role.charAt(0).toUpperCase() + role.slice(1)}
          <span className="sr-only">Select role</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleRoleChange("admin")}>
          Admin
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange("department")}>
          Department
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange("teacher")}>
          Teacher
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
