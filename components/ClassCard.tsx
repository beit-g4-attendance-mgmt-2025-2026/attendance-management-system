import React from "react";
import { Button } from "./ui/button";
import { ClassItem } from "@/app/(protected)/(HOD)/classes/page";
import Link from "next/link";

interface CardProps {
	classItem: ClassItem;
	variant: "classes" | "my-class";
}
const ClassCard = ({ classItem, variant }: CardProps) => {
	const reportHref =
		variant === "classes"
			? `/classes/${classItem.name}/report`
			: `/my-class/${classItem.name}/report`;

	const studentsHref =
		variant === "classes"
			? `/classes/${classItem.name}`
			: `/my-class/${classItem.id}`;
	return (
		<div className="w-full p-4 flex flex-col  space-y-5  rounded-2xl border-gray-300 border  shadow-lg">
			<h2 className="text-lg font-semibold text-text-color mt-2">
				{classItem.name}
			</h2>
			<div className="space-y-1">
				<h3 className="text-text-color  font-semibold">
					Family Teacher
				</h3>
				<p className="text-sm">{classItem.familyTeacher}</p>
			</div>
			<div className="flex justify-between">
				<div className="flex flex-col items-center">
					<h3 className="text-text-color font-semibold">Male</h3>
					<p className="text-sm">{classItem.male}</p>
				</div>
				<div className="flex flex-col items-center">
					<h3 className="text-text-color font-semibold">Female</h3>
					<p className="text-sm">{classItem.female}</p>
				</div>
				<div className="flex flex-col items-center">
					<h3 className="text-text-color font-semibold">Total</h3>
					<p className="text-sm">{classItem.total}</p>
				</div>
			</div>
			<div className="flex justify-between px-1">
				<Link href={reportHref}>
					<Button className="cursor-pointer text-white rounded-full bg-sky-600 hover:bg-sky-700 hover:text-white">
						View Report
					</Button>
				</Link>
				<Link href={studentsHref}>
					<Button className="cursor-pointer text-white rounded-full bg-sky-600 hover:bg-sky-700 hover:text-white">
						View Class
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default ClassCard;
