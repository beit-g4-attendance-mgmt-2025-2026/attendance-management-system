import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Subject } from "@/app/(protected)/(teacher)/my-subjects/page";

interface CardProps {
	subject: Subject;
}
const SubjectCard = ({ subject }: CardProps) => {
	return (
		<div className="w-full p-4 flex flex-col  space-y-5  rounded-2xl border-gray-300 border  shadow-lg">
			<h2 className="text-lg font-semibold text-text-color mt-2">
				{subject.name}
			</h2>
			<div className="flex justify-between">
				<div className="flex flex-col items-center">
					<h3 className="text-text-color font-semibold">Code</h3>
					<p className="text-sm">{subject.code}</p>
				</div>
				<div className="flex flex-col items-center">
					<h3 className="text-text-color font-semibold">Room</h3>
					<p className="text-sm">({subject.room})</p>
				</div>
				<div className="flex flex-col items-center">
					<h3 className="text-text-color font-semibold">Total</h3>
					<p className="text-sm">{subject.total}</p>
				</div>
			</div>
			<div className="flex justify-between px-1 mt-5">
				<Link href={`/my-subjects/${subject.name}/report`}>
					<Button className="cursor-pointer text-white rounded-full bg-sky-600 hover:bg-sky-700 hover:text-white">
						View Report
					</Button>
				</Link>
				<Link href={`/my-subjects/${subject.name}`}>
					<Button className="cursor-pointer text-white rounded-full bg-sky-600 hover:bg-sky-700 hover:text-white">
						Take Attendance
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default SubjectCard;
