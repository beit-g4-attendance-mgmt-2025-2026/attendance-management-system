"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/inputs/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import z from "zod";
import FormSelect from "@/components/inputs/FormSelect";
import { genders, semesters, Years } from "@/constants/index.constants";
import { StudentWithDetails } from "@/types/index.types";
import { CreateStudentSchema } from "@/lib/schema/CreateStudentSchema";
import { useEffect, useState } from "react";
import { Gender, Semester, Year } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import { toast } from "sonner";

const StudentForm = ({
  isEdit = false,
  student,
  onClose,
}: {
  isEdit: boolean;
  student?: StudentWithDetails | null;
  onClose?: () => void;
}) => {
  const router = useRouter();
  //   const [isOpen, setIsOpen] = useState(true);

  const form = useForm<z.infer<typeof CreateStudentSchema>>({
    resolver: zodResolver(CreateStudentSchema),
    defaultValues: {
      name: "",
      rollNo: "",
      dateOfBirth: "",
      semester: undefined,
      year: undefined,
      gender: undefined,
      email: "",
      phoneNumber: "",
      classId: "",
    },
  });

  useEffect(() => {
    if (!student) return;

    form.reset({
      name: student.name,
      rollNo: student.rollNo,
      dateOfBirth: student.dateOfBirth
        ? new Date(student.dateOfBirth).toISOString().split("T")[0]
        : "",
      semester: student.semester,
      year: student.year,
      gender: student.gender,
      email: student.email,
      phoneNumber: student.phoneNumber,
      classId: student.classId,
    });
  }, [student, form]);

  const {
    formState: { isSubmitting },
  } = form;
  const handleClose = () => {
    router.back();
  };

  async function onSubmit(values: z.infer<typeof CreateStudentSchema>) {
    try {
      if (isEdit && student) {
        // update payload (remove empty strings)
        const updateData: Partial<{
          name: string;
          rollNo: string;
          dateOfBirth: string | null;
          email: string;
          phoneNumber: string;
          gender: Gender;
          year: Year;
          semester: Semester;
          classId: string;
        }> = {
          name: values.name as string,
          rollNo: values.rollNo as string,
          dateOfBirth: values.dateOfBirth ? (values.dateOfBirth as string) : null,
          email: values.email as string,
          phoneNumber: values.phoneNumber as string,
          gender: values.gender as Gender,
          year: values.year as Year,
          semester: values.semester as Semester,
          classId: values.classId as string,
        };

        const res = await api.students.update(student.id, updateData);
        console.log("updated Student: ", res);
        if (res?.success) {
          router.refresh();
          onClose?.();
          return;
        }
      } else {
        const data = {
          name: values.name as string,
          rollNo: values.rollNo as string,
          dateOfBirth: values.dateOfBirth ? (values.dateOfBirth as string) : null,
          email: values.email as string,
          phoneNumber: values.phoneNumber as string,
          gender: values.gender as Gender,
          year: values.year as Year,
          semester: values.semester as Semester,
          classId: values.classId as string,
        };

        const res = await api.students.create(data);
        console.log("create student: ", res);
        if (res?.success) {
          router.refresh();
          onClose?.();
          return;
        }
      }
    } catch (error: any) {
      const message = error.message;

      if (message.includes("Email")) {
        form.setError("email", { message });
      } else if (message.includes("Name")) {
        form.setError("name", { message });
      } else {
        toast.error(message);
      }
    }
  }

  const handleCancel = () => {
    router.back();
  };
  return (
    <div className="flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.log("Zod Errors:", errors),
          )}
          className="space-y-5 w-full"
        >
          <FormInput
            form={form}
            name="name"
            label="Name"
            placeholder="Enter name"
            disabled={isSubmitting}
          />

          <FormInput
            form={form}
            name="rollNo"
            label="Roll Number"
            placeholder="Enter roll number"
            disabled={isSubmitting}
          />

          <FormInput
            form={form}
            name="dateOfBirth"
            label="Date of birth"
            type="date"
            disabled={isSubmitting}
          />

          <div className="flex gap-6">
            <div className="rounded-md w-4/12 mt-5">
              <FormSelect
                disabled={isSubmitting}
                form={form}
                name="semester"
                placeholder="Semester"
                options={semesters as any}
                id="form-rhf-select-semester"
                triggerClassName="min-w-[120px] cursor-pointer"
              />
            </div>
            <div className="rounded-md w-4/12 mt-5">
              <FormSelect
                disabled={isSubmitting}
                form={form}
                name="year"
                placeholder="Year"
                options={Years as any}
                id="form-rhf-select-year"
                triggerClassName="min-w-[120px] cursor-pointer"
              />
            </div>

            <div className="rounded-md w-4/12 mt-5">
              <FormSelect
                disabled={isSubmitting}
                form={form}
                name="gender"
                placeholder="Gender"
                options={genders as any}
                id="form-rhf-select-gender"
                triggerClassName="min-w-[120px] cursor-pointer"
              />
            </div>
          </div>
          <FormInput
            form={form}
            name="email"
            label="Email address"
            placeholder="Enter email address"
            className="w-full"
            disabled={isSubmitting}
          />
          <FormInput
            form={form}
            name="phoneNumber"
            label="Phone number"
            placeholder="Enter phone number"
            className="w-full"
            disabled={isSubmitting}
          />

          <div className="flex gap-3 items-center justify-end mt-10">
            <Button
              type="button"
              variant="destructive"
              className="cursor-pointer min-w-36"
              onClick={handleCancel}
            >
              Cancel
            </Button>{" "}
            <Button
              disabled={isSubmitting}
              type="submit"
              className="cursor-pointer min-w-36 text-white bg-sky-600 hover:bg-sky-700 hover:text-white"
            >
              {isEdit ? "Save Changes" : "Add Student"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StudentForm;
