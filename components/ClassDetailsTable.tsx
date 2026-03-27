"use client";

import { ConfirmBtn } from "@/components/ConfirmBtn";
import { DialogCardBtn } from "@/components/DialogCardBtn";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { StudentWithDetails } from "@/types/index.types";
import { Edit, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Paginationn } from "./Pagination";
import StudentForm from "@/app/(protected)/(admin)/students/components/StudentForm";

const ClassDetailsTable = ({
  students,
  page,
  pageSize,
  total,
}: {
  students: StudentWithDetails[];
  page: number;
  pageSize: number;
  total: number;
}) => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setLoadingId(id);
      const res = await api.students.delete(id);
      if (res.success) {
        toast.success(res.data.message ?? "Student deleted successfully");
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Roll No</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="w-[120px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => (
            <TableRow
              key={student.id}
              className={
                index % 2 === 0
                  ? ""
                  : "bg-blue-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-50"
              }
            >
              <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.rollNo}</TableCell>
              <TableCell>{student.semester}</TableCell>
              <TableCell>{student.year}</TableCell>
              <TableCell>{student.gender}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.phoneNumber}</TableCell>
              <TableCell className="flex items-center gap-1">
                <DialogCardBtn
                  triggerIcon={<Edit />}
                  title="Edit Student"
                  description=""
                >
                  <StudentForm
                    key={student.id}
                    isEdit={true}
                    student={student}
                    onClose={() => {}}
                  />
                </DialogCardBtn>

                <ConfirmBtn
                  title="Delete student?"
                  description="This action cannot be undone."
                  confirmLabel="Delete"
                  onConfirm={() => handleDelete(student.id)}
                >
                  <Button
                    disabled={loadingId === student.id}
                    variant={"ghost"}
                    className="text-red-500 cursor-pointer hover:text-red-700"
                  >
                    <TrashIcon />
                  </Button>
                </ConfirmBtn>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Paginationn page={page} pageSize={pageSize} total={total} />
    </div>
  );
};

export default ClassDetailsTable;
