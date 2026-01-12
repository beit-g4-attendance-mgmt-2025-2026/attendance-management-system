"use client";

import { Button } from "@/components/ui/button";
import { StudentProfileCardProps } from "@/types/index.types";
import {
	CircleUserIcon,
	GraduationCap,
	MailIcon,
	PhoneCall,
} from "lucide-react";

export function StudentProfileCard({ student }: StudentProfileCardProps) {
	if (!student) {
		return (
			<div className="w-full">
				<div className="flex flex-col items-center space-y-3 p-4 border rounded-lg border-gray-200 dark:border-gray-700">
					<p className="text-gray-400 text-center">
						Select a student to view profile
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="flex flex-col items-center space-y-3">
				<h1 className="font-semibold text-sm">{student.student_id}</h1>

				<div>
					<CircleUserIcon size={160} />
				</div>

				<h1 className="font-bold">{student.name}</h1>
				<h2 className="text-gray-400 text-center">
					{student.department}
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
							{student.dateOfBirth || "N/A"}
						</span>
					</div>
					<div className="flex flex-col">
						<span>Gender</span>
						<span className="text-gray-400 text-sm">
							{student.gender}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
