import ClassCard from "@/components/ClassCard";
import React from "react";
import { GetClasses } from "@/lib/actions/GetClasses";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}) => {
  const { page, pageSize, search, filter } = await searchParams;

  const { data } = await GetClasses({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    search: search || "",
    filter,
  });

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
