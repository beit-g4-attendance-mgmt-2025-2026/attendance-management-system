import ClassCard from "@/components/ClassCard";
import SubHeader from "@/components/sub-header";
import React from "react";

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
    <main>
      <SubHeader isTeacher={false} />
      <div className="grid md:grid-cols-3 gap-10">
        <ClassCard classItem={myclass} variant="my-class" />
      </div>
    </main>
  );
};

export default page;
