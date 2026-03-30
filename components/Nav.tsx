"use client";
import { ModeToggle } from "./mode-toggle";
import ProfileWithPopup from "./Profile";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function Nav() {
  const user = useAuthStore((s) => s.user);
  const admin = useAuthStore((s) => s.admin);

  const userInfo =
    user != null
      ? {
          name: user.fullName,
          avator: "",
        }
      : admin != null
        ? {
            name: admin.username,
            avator: "",
          }
        : { name: "", avator: "" };

  return (
    <div className=" top-0 sticky z-50 w-full bg-background h-16 px-4 border-b flex items-center justify-between shadow-md">
      <h1 className="font-semibold text-xl">Attendance System</h1>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <ProfileWithPopup userInfo={userInfo} />
      </div>
    </div>
  );
}
