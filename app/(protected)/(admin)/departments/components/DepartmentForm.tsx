"use client";

import { Form } from "@/components/ui/form";
import FormInput from "@/components/inputs/FormInput";
import { Button } from "@/components/ui/button";
import { DepartmentSchema } from "@/schema/index.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import fetchHandler from "@/lib/fetchHandler";
import { useState } from "react";

type DepartmentFormValues = {
  name: string;
  symbol: string;
  logo: File | null;
};

const DepartmentForm = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(DepartmentSchema),
    defaultValues: {
      name: "",
      symbol: "",
      logo: null,
    },
  });

  const onSubmit = async (values: DepartmentFormValues) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("symbol", values.symbol);

      if (values.logo) {
        formData.append("logo", values.logo);
      }

      const res = await fetch("/api/departments", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Department added successfully");
      } else {
        toast.error(data?.message || "Failed to add department");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => router.back();

  return (
    <div className="flex items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-xl">
          <FormInput
            form={form}
            name="name"
            label="Name"
            placeholder="Enter department name"
            className="w-full min-w-[140px]"
          />

          <FormInput
            form={form}
            name="symbol"
            label="Symbol"
            placeholder="Enter department symbol"
            className="w-full min-w-[140px]"
          />

          <Controller
            control={form.control}
            name="logo"
            render={({ field, fieldState }) => (
              <div>
                <label className="block mb-1 font-medium">Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                  className="w-full"
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="flex gap-3 items-center justify-end mt-10">
            <Button
              disabled={submitting}
              type="button"
              variant="destructive"
              className="min-w-36"
              onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              disabled={submitting}
              type="submit"
              className="min-w-36 text-white bg-sky-600 hover:bg-sky-700">
              Add Department
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DepartmentForm;
