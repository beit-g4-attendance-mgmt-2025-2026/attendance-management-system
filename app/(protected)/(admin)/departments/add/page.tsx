"use client";
import { Button } from "@/components/ui/button";
import DepartmentForm from "../components/DepartmentForm";
import { IoChevronBackSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div>
      <header className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <IoChevronBackSharp
            className="size-6 mt-1 cursor-pointer"
            onClick={() => router.back()}
          />
          <span className="text-2xl">Add Department</span>
        </div>
        <Button variant={"link"} className="text-sky-600">
          Import CSV
        </Button>
      </header>
      <main className="mt-6">
        <DepartmentForm />
      </main>
    </div>
  );
};

export default Page;
