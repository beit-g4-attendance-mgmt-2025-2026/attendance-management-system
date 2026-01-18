import ClassCard from "@/components/ClassCard";
import { DialogCardBtn } from "@/components/DialogCardBtn";
import SearchInput from "@/components/inputs/SearchInput";
import React from "react";
import SubjectForm from "../../(HOD)/(subject)/components/SubjectForm";
import ClassForm from "@/components/ClassForm";

export interface ClassItem {
  id: string;
  name: string;
  familyTeacher: string;
  male: number;
  female: number;
  total: number;
}
const page = () => {
  const myclass: ClassItem = {
    id: "first-year-first-sem",
    name: "First Year (First Semester)",
    familyTeacher: "Dr. Thida Khaing",
    male: 32,
    female: 24,
    total: 56,
  };

  return (
    <div className="grid md:grid-cols-3 gap-10">
      <ClassCard classItem={myclass} variant="my-class" />
    </div>
  );
};

export default page;
