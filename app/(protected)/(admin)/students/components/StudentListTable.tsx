"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, TrashIcon } from "lucide-react";
import { ConfirmBtn } from "@/components/ConfirmBtn";
import { DialogCardBtn } from "@/components/DialogCardBtn";
import StudentForm from "./StudentForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { StudentWithDetails } from "@/types/index.types";

export interface StudentsListTableProps {
  students: StudentWithDetails[];
}

const StudentsListTable = ({ students }: StudentsListTableProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const res = await api.students.delete(id);
      if (res.success) toast.success(res.data.message);
      router.refresh();
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Roll No</TableHead>
          <TableHead>Semester</TableHead>
          <TableHead>Year</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students?.map((student, index) => (
          <TableRow
            key={student.id}
            className={`cursor-pointer 	${
              index % 2 === 0
                ? ""
                : "bg-blue-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-50 "
            }`}
          >
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.rollNo}</TableCell>
            <TableCell>{student.semester}</TableCell>
            <TableCell>{student.year}</TableCell>
            <TableCell
              className="max-w-[200px] truncate"
              title={student.department.name}
            >
              {student.department.name}
            </TableCell>{" "}
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
                  disabled={loading}
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
  );
};

export default StudentsListTable;
