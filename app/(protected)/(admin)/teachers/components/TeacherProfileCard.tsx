"use client";

import { Button } from "@/components/ui/button";
import { User } from "@/generated/prisma/client";
import {
	CircleUserIcon,
	GraduationCap,
	MailIcon,
	PhoneCall,
} from "lucide-react";

export interface TeacherProfileCardProps {
	teacher: User | null;
}

export function TeacherProfileCard({ teacher }: TeacherProfileCardProps) {
	if (!teacher) {
		return;
	}

	return (
		<div className="w-4/12 sticky top-0  h-[400px]  shadow-2xl rounded-2xl">
			<div className="flex flex-col items-center space-y-3">
				<h1 className="font-semibold text-sm">{teacher.fullName}</h1>

				<div>
					<CircleUserIcon size={160} />
				</div>

				<h1 className="font-bold">{teacher.email}</h1>
				<h2 className="text-gray-400 text-center">
					{teacher.departmentId}
				</h2>

				<div className="flex gap-3 items-center">
					<Button variant={"secondary"} className="cursor-pointer">
						<GraduationCap className="cursor-pointer" />
					</Button>
					<Button variant={"secondary"} className="cursor-pointer">
						<PhoneCall className="cursor-pointer" />
					</Button>
					<Button variant={"secondary"} className="cursor-pointer">
						<MailIcon className="cursor-pointer" />
					</Button>
				</div>

				<div className="flex justify-evenly items-center gap-4">
					<div className="flex flex-col">
						<span>Date of Birth</span>
						<span className="text-gray-400 text-sm">
							{teacher.gender || "N/A"}
						</span>
					</div>
					<div className="flex flex-col">
						<span>Gender</span>
						<span className="text-gray-400 text-sm">
							{teacher.gender}
						</span>
					</div>
				</div>

				{/* <div className="w-full border-t border-gray-200 dark:border-gray-700 pt-4">
					<div className="flex flex-col  space-y-2">
						<div>
							<span className="text-sm font-semibold">Email</span>
							<p className="text-gray-400 text-sm">
								{teacher.email}
							</p>
						</div>
						<div>
							<span className="text-sm font-semibold">Phone</span>
							<p className="text-gray-400 text-sm">
								{teacher.phone || "N/A"}
							</p>
						</div>
						<div>
							<span className="text-sm font-semibold">Role</span>
							<p className="text-gray-400 text-sm">
								{teacher.role}
							</p>
						</div>
					</div>
				</div> */}
			</div>
		</div>
	);
}
