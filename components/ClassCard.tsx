import React from "react";
import { Button } from "./ui/button";
interface ClassItem {
  id: string;
  name: string;
  familyTeacher: string;
  male: number;
  female: number;
  total: number;
}

import Link from "next/link";
import { Semester, Year } from "@/generated/prisma/enums";

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
      ? `/classes/${classItem.id}`
      : `/my-class/${classItem.id}`;
  return (
    <div className="w-full p-4 flex flex-col  space-y-5  rounded-2xl border-gray-300 border  shadow-lg">
      <h2 className="text-lg font-semibold text-text-color mt-2">
        {classItem.name}
      </h2>
      <div className="space-y-1">
        <h3 className="text-text-color  font-semibold">Family Teacher</h3>
        <p className="text-sm">
          {classItem.familyTeacher === "Not assigned" ? (
            <div className="text-amber-600">{classItem.familyTeacher}</div>
          ) : (
            classItem.familyTeacher
          )}
        </p>
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
      <div className="flex justify-center space-x-3 px-1 mt-5">
        <Link href={reportHref}>
          <Button className="cursor-pointer w-34  text-white rounded-full bg-sky-600 hover:bg-sky-700 hover:text-white">
            View Report
          </Button>
        </Link>
        <Link href={studentsHref}>
          <Button className="cursor-pointer w-34 text-white rounded-full bg-sky-600 hover:bg-sky-700 hover:text-white">
            View Class
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ClassCard;
