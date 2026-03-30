"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2Icon, TrashIcon, UserRoundPlus, UserRoundX } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { DepartmentTableItem, HodCandidate } from "@/types/index.types";
import { ConfirmBtn } from "@/components/ConfirmBtn";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  departments: DepartmentTableItem[];
  onDeleted?: (id: string) => void;
  onChanged?: () => Promise<void> | void;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

const DepartmentsListTable = ({ departments, onDeleted, onChanged }: Props) => {
  const [assignDialogDepartment, setAssignDialogDepartment] =
    useState<DepartmentTableItem | null>(null);
  const [candidates, setCandidates] = useState<HodCandidate[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [assigningHod, setAssigningHod] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [removingHodId, setRemovingHodId] = useState<string | null>(null);

  const closeAssignDialog = () => {
    setAssignDialogDepartment(null);
    setCandidates([]);
    setSelectedUserId("");
    setLoadingCandidates(false);
    setAssigningHod(false);
  };

  const openAssignDialog = async (department: DepartmentTableItem) => {
    try {
      setAssignDialogDepartment(department);
      setLoadingCandidates(true);

      const res = await api.departments.getHodCandidates(department.id);
      const users = (res?.data?.candidates ?? []) as HodCandidate[];
      setCandidates(users);
      setSelectedUserId(department.hodId ?? users[0]?.id ?? "");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to load users"));
      closeAssignDialog();
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleAssignHod = async () => {
    if (!assignDialogDepartment) return;
    if (!selectedUserId) {
      toast.error("Please choose a user");
      return;
    }

    try {
      setAssigningHod(true);
      const res = await api.departments.assignHod(
        assignDialogDepartment.id,
        selectedUserId,
      );

      if (res?.success) {
        toast.success("HOD assigned successfully");
        closeAssignDialog();
        await onChanged?.();
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to assign HOD"));
    } finally {
      setAssigningHod(false);
    }
  };

  const handleRemoveHod = async (departmentId: string) => {
    try {
      setRemovingHodId(departmentId);
      const res = await api.departments.removeHod(departmentId);

      if (res?.success) {
        toast.success("HOD removed successfully");
        await onChanged?.();
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to remove HOD"));
    } finally {
      setRemovingHodId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await fetch(`/api/departments/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (res.ok && json?.success) {
        toast.success("Department deleted successfully");
        onDeleted?.(id);
      } else {
        toast.error(json?.message || "Failed to delete department");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Something went wrong"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
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
              }`}
            >
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
                  <span className="text-balance leading-tight">
                    {department.name}
                  </span>
                </span>
              </TableCell>
              <TableCell>{department.symbol}</TableCell>
              <TableCell>{department.head_of_department ?? "-"}</TableCell>
              <TableCell>{department.email ?? "-"}</TableCell>
              <TableCell>{department.phone ?? "-"}</TableCell>
              <TableCell>{department.teachers}</TableCell>
              <TableCell>{department.students}</TableCell>
              <TableCell className="flex items-center gap-1">
                <Link
                  href={`/departments/${department.id}/edit`}
                  className="text-blue-500"
                >
                  <Edit2Icon size={16} />
                </Link>

                <Button
                  variant="ghost"
                  className="text-sky-600 hover:text-sky-700 cursor-pointer"
                  onClick={() => openAssignDialog(department)}
                  title="Assign HOD"
                >
                  <UserRoundPlus size={16} />
                </Button>

                <ConfirmBtn
                  title="Remove HOD?"
                  description={`Remove HOD from ${department.symbol} department?`}
                  confirmLabel="Remove"
                  onConfirm={() => handleRemoveHod(department.id)}
                  disabled={
                    !department.hodId || removingHodId === department.id
                  }
                >
                  <Button
                    variant="ghost"
                    className="text-amber-600 hover:text-amber-700 cursor-pointer"
                    disabled={
                      !department.hodId || removingHodId === department.id
                    }
                    title="Remove HOD"
                  >
                    <UserRoundX size={16} />
                  </Button>
                </ConfirmBtn>

                <ConfirmBtn
                  title="Delete department?"
                  description="This action cannot be undone."
                  confirmLabel="Delete"
                  onConfirm={() => handleDelete(department.id)}
                  disabled={deletingId === department.id}
                >
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    disabled={deletingId === department.id}
                    title="Delete Department"
                  >
                    <TrashIcon />
                  </Button>
                </ConfirmBtn>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={Boolean(assignDialogDepartment)}
        onOpenChange={(open) => {
          if (!open) closeAssignDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign HOD</DialogTitle>
            <DialogDescription>
              {assignDialogDepartment
                ? `Choose one user for ${assignDialogDepartment.name}.`
                : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <p className="text-sm font-medium">Department users</p>
            <Select
              value={selectedUserId || undefined}
              onValueChange={setSelectedUserId}
              disabled={
                loadingCandidates || assigningHod || candidates.length === 0
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.fullName} ({user.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!loadingCandidates && candidates.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No teacher users found in this department.
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeAssignDialog}
              className="cursor-pointer"
              disabled={assigningHod}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAssignHod}
              disabled={assigningHod || loadingCandidates || !selectedUserId}
              className="cursor-pointer text-white bg-sky-600 hover:bg-sky-700 hover:text-white"
            >
              {assigningHod ? "Assigning..." : "Assign HOD"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepartmentsListTable;
