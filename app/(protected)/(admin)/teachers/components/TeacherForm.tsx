"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/inputs/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import z from "zod";
import FormSelect from "@/components/inputs/FormSelect";
import { genders, roles } from "@/constants/index.constants";
import { TeacherSchema } from "@/schema/index.schema";
import { api } from "@/lib/api";

import { toast } from "sonner";
import { Gender, Role } from "@/generated/prisma/client";
import { useEffect, useState } from "react";
import { PublicUser } from "@/lib/user";
import { DepartmentTableItem } from "@/types/index.types";

type TeacherFormTeacher = PublicUser & {
  department?: {
    symbol: string;
    name?: string;
  } | null;
};

const TeacherForm = ({
  isEdit = false,
  teacher,
  onClose,
  redirectTo,
}: {
  isEdit: boolean;
  teacher?: TeacherFormTeacher | null;
  onClose?: () => void;
  redirectTo?: string;
}) => {
  const router = useRouter();
  const schema = teacher && isEdit ? TeacherSchema.partial() : TeacherSchema;
  const [departmentOptions, setDepartmentOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [departmentLoading, setDepartmentLoading] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: teacher?.fullName || "",
      username: teacher?.username || "",
      email: teacher?.email || "",
      phoneNumber: teacher?.phoneNumber || "",
      gender: teacher?.gender || genders[0].value,
      role: teacher?.role || roles[2].value,
      departmentName: teacher?.department?.symbol || "",
    },
  });

  useEffect(() => {
    let isMounted = true;

    const loadDepartments = async () => {
      try {
        setDepartmentLoading(true);
        const res = await api.departments.getAll();
        const items = (res?.data?.formattedDepartment ??
          []) as DepartmentTableItem[];

        if (!isMounted) return;

        const options = items.map((d) => ({
          label: `${d.name} (${d.symbol})`,
          value: d.symbol,
        }));

        setDepartmentOptions(options);

        const currentDepartment =
          teacher?.department?.symbol || form.getValues("departmentName");

        if (currentDepartment) {
          form.setValue("departmentName", currentDepartment, {
            shouldDirty: false,
          });
          return;
        }

        if (options.length > 0) {
          form.setValue("departmentName", options[0].value, {
            shouldDirty: false,
          });
        }
      } catch (error: unknown) {
        if (!isMounted) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to load departments",
        );
      } finally {
        if (isMounted) {
          setDepartmentLoading(false);
        }
      }
    };

    loadDepartments();

    return () => {
      isMounted = false;
    };
  }, [form, teacher]);

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      if (isEdit && teacher) {
        // update payload (remove empty strings)
        const updateData: Partial<{
          fullName: string;
          username: string;
          email: string;
          phoneNumber: string;
          gender: Gender;
          departmentName: string;
        }> = {
          fullName: values.fullName as string,
          username: values.username as string,
          email: values.email as string,
          phoneNumber: values.phoneNumber as string,
          gender: values.gender as Gender,
          departmentName: values.departmentName as string,
        };

        const res = await api.users.update(teacher.id, updateData);

        if (res?.success) {
          router.refresh();
          onClose?.();
          return;
        }
      } else {
        const data = {
          fullName: values.fullName as string,
          username: values.username as string,
          email: values.email as string,
          password: values.password as string,
          phoneNumber: values.phoneNumber as string,
          gender: values.gender as Gender,
          role: values.role as Role,
          departmentName: values.departmentName as any,
        };

        const res = await api.users.create(data);

        if (res?.success) {
          if (redirectTo) {
            router.push(redirectTo);
            return;
          }

          router.refresh();
          onClose?.();
          return;
        }
      }
    } catch (error: any) {
      const message = error.message;

      if (message.includes("Email")) {
        form.setError("email", { message });
      } else if (message.includes("Username")) {
        form.setError("username", { message });
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
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 w-full"
        >
          <FormInput
            form={form}
            name="fullName"
            label="Full Name"
            placeholder="Enter full name"
            disabled={isSubmitting}
          />

          <FormInput
            form={form}
            name="username"
            label="Username"
            placeholder="Enter username"
            disabled={isSubmitting}
          />

          <FormInput
            form={form}
            name="email"
            label="Email address"
            placeholder="Enter email address"
            className="w-full"
            disabled={isSubmitting}
          />

          <div className="flex gap-6">
            {!isEdit && !teacher && (
              <div className=" w-8/12">
                <FormInput
                  form={form}
                  name="password"
                  label="Password"
                  placeholder={isEdit ? "••••••••" : "Enter password"}
                  className={`w-full ${isEdit ?? "cursor-not-allowed"}`}
                  disabled={isSubmitting || isEdit}
                />
              </div>
            )}
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
          <div className="flex gap-6">
            <div className=" w-8/12">
              <FormInput
                form={form}
                name="phoneNumber"
                label="Phone number"
                placeholder="Enter phone number"
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
            <div className="rounded-md w-4/12 mt-5">
              <FormSelect
                disabled={
                  isSubmitting ||
                  departmentLoading ||
                  departmentOptions.length === 0 ||
                  teacher?.role === "HOD"
                }
                form={form}
                name="departmentName"
                placeholder={departmentLoading ? "Loading..." : "Department"}
                options={departmentOptions}
                id="form-rhf-select-department"
                triggerClassName="min-w-[120px] cursor-pointer"
              />
            </div>
          </div>

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
              {isEdit ? "Save Changes" : "Add Teacher"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TeacherForm;
