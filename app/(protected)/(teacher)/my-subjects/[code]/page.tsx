"use client";
import SearchInput from "@/components/inputs/SearchInput";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { IoChevronBackSharp } from "react-icons/io5";

interface PageProps {
  params: Promise<{ code: string }>;
}
const page = ({ params }: PageProps) => {
  const paramData = React.use(params);
  const router = useRouter();

  const ControlSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Saved");
    router.push(`${paramData.code}/report`);
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-10 mx-auto w-auto">
        <div className="flex items-center space-x-3">
          <IoChevronBackSharp
            className="size-6 mt-1 cursor-pointer"
            onClick={() => router.back()}
          />
          <span className="text-xl font-semibold">{paramData.code}</span>
        </div>
        <div className="flex items-center px-4 py-1  gap-4 shadow-sm border border-muted/50 dark:bg-[#172139] bg-gray-200 rounded-2xl">
          <SearchInput
            placeholder={"Search for a student by name or roll-no"}
          />
        </div>
        <Button
          type="submit"
          form="attendance"
          className="cursor-pointer text-white bg-sky-600 hover:bg-sky-700 ">
          Save
        </Button>
      </header>

      <form id="attendance" action="" onSubmit={ControlSave}></form>
    </div>
  );
};

export default page;
