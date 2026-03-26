import ClassCard from "@/components/ClassCard";
import { DialogCardBtn } from "@/components/DialogCardBtn";
import SearchInput from "@/components/inputs/SearchInput";
import React from "react";
import ClassForm from "@/components/ClassForm";
import { GetClasses } from "@/lib/actions/GetClasses";

// export interface ClassItem {
// 	id: string;
// 	name: string;
// 	familyTeacher: string;
// 	male: number;
// 	female: number;
// 	total: number;
// }
const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}) => {
  // const classes: ClassItem[] = [
  // 	{
  // 		id: "first-year-first-sem",
  // 		name: "First Year (First Semester)",
  // 		familyTeacher: "Dr. Thida Khaing",
  // 		male: 32,
  // 		female: 24,
  // 		total: 56,
  // 	},
  // 	{
  // 		id: "second-year-first-sem",
  // 		name: "Second Year (First Semester)",
  // 		familyTeacher: "Daw Aye Aye Swe",
  // 		male: 21,
  // 		female: 26,
  // 		total: 47,
  // 	},
  // 	{
  // 		id: "third-year-first-sem",
  // 		name: "Third Year (First Semester)",
  // 		familyTeacher: "Daw Ni Ni Thin",
  // 		male: 15,
  // 		female: 18,
  // 		total: 32,
  // 	},
  // 	{
  // 		id: "fourth-year-first-sem",
  // 		name: "Fourth Year (First Semester)",
  // 		familyTeacher: "Dr. Nu Nu Htwe",
  // 		male: 13,
  // 		female: 17,
  // 		total: 30,
  // 	},
  // 	{
  // 		id: "fourth-year-second-sem",
  // 		name: "Fourth Year (Second Semester)",
  // 		familyTeacher: "Dr. Myat Thu Aye",
  // 		male: 11,
  // 		female: 11,
  // 		total: 22,
  // 	},
  // 	{
  // 		id: "fifth-year-first-sem",
  // 		name: "Fifth Year (First Semester)",
  // 		familyTeacher: "Daw May Thida Aung",
  // 		male: 7,
  // 		female: 11,
  // 		total: 18,
  // 	},
  // 	{
  // 		id: "final-year-first-sem",
  // 		name: "Final Year (First Semester)",
  // 		familyTeacher: "Dr. Peral Ei Phyu",
  // 		male: 6,
  // 		female: 6,
  // 		total: 12,
  // 	},
  // ];
  const URL = "http://localhost:3000";
  const { page, pageSize, search, filter } = await searchParams;

  const { data } = await GetClasses({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    search: search || "",
    filter,
  });

  const total = data?.total ?? 0;
  const { classes = [] } = data || {};
  return (
    <>
      {classes?.length ? (
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-start">
          {classes.map((cls) => (
            <ClassCard key={cls.id} classItem={cls} variant="classes" />
          ))}
        </main>
      ) : (
        <p className="text-muted-foreground">No classes found.</p>
      )}
    </>
  );
};

export default page;
