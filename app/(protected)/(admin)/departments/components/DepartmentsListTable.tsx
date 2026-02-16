import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DepartmentTableItem } from "@/types/index.types";
import { Edit2Icon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import fetchHandler from "@/lib/fetchHandler";

type Props = {
  departments: DepartmentTableItem[];
  onDeleted?: (id: string) => void;
};

const DepartmentsListTable = ({ departments, onDeleted }: Props) => {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;

    try {
      const res = await fetchHandler(`/api/departments/${id}`, {
        method: "DELETE",
      });

      if (res?.success) {
        toast.success("Department deleted successfully");
        if (onDeleted) onDeleted(id); // remove from local state
      } else {
        toast.error(res?.message || "Failed to delete department");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <Table className="w-full overflow-hidden">
      <TableCaption className="text-gray-300">Departments List</TableCaption>
      <TableHeader>
        <TableRow className="font-semibold">
          <TableHead>Name</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Head of Department</TableHead>
          <TableHead>email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Teachers</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments?.map((department, index) => (
          <TableRow
            key={department.id}
            className={`cursor-pointer transition-colors border-none ${
              index % 2 === 0
                ? ""
                : "bg-blue-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-50 "
            }`}>
            <TableCell>
              <span className="flex items-center gap-3">
                {department.logo ? (
                  <img
                    src={department.logo}
                    alt={department.name}
                    className="w-10 h-10 object-cover rounded-full border"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                    No Logo
                  </div>
                )}
                {department.name}
              </span>
            </TableCell>
            <TableCell>{department.symbol}</TableCell>
            <TableCell>{department.head_of_department}</TableCell>
            <TableCell>{department.email}</TableCell>
            <TableCell>{department.phone}</TableCell>
            <TableCell>{department.teachers}</TableCell>
            <TableCell>{department.students}</TableCell>
            <TableCell className="flex items-center gap-1">
              <Link
                href={`/departments/${department.id}/edit`}
                className="text-blue-500">
                <Edit2Icon size={16} />
              </Link>
              <Button
                variant={"ghost"}
                className="text-red-500 hover:text-red-700 cursor-pointer"
                onClick={() => handleDelete(department.id)}>
                <TrashIcon />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DepartmentsListTable;
