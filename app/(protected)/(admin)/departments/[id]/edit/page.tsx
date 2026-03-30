"use client";
import { IoChevronBackSharp } from "react-icons/io5";
import { useRouter, useParams } from "next/navigation";
import DepartmentForm from "../../components/DepartmentForm";

const EditDepartmentPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  if (!id)
    return (
      <div className="text-center text-gray-500 mt-10">
        Department ID not found
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <IoChevronBackSharp
            className="text-2xl cursor-pointer"
            onClick={() => router.back()}
          />
          <h1 className="text-2xl font-semibold">Edit Department</h1>
        </div>
      </header>

      <main>
        <DepartmentForm departmentId={id} isEdit />
      </main>
    </div>
  );
};

export default EditDepartmentPage;
