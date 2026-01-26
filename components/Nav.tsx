"use client";
import { Mail, MailCheck } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { RoleToggle } from "./role-change";
import ProfileWithPopup from "./Profile";
export default function Nav() {
	const userInfo = {
		name: "John Doe",
		email: "john@gmail.com",
		avator: "https://i.pravatar.cc/150?img=3",
	};
	return (
		<div className=" top-0 sticky z-50 w-full bg-background h-16 px-4 border-b flex items-center justify-between shadow-md">
			<h1 className="font-semibold text-xl">Attendance System</h1>
			<RoleToggle />
			<div className="flex items-center space-x-4">
				<ModeToggle /> <Mail />
				<ProfileWithPopup userInfo={userInfo} />
			</div>
		</div>
	);
}
