"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/inputs/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import z from "zod";
import FormSelect from "@/components/inputs/FormSelect";
import { genders } from "@/constants/index.constants";
import { StudentWithDetails } from "@/types/index.types";
import { CreateStudentSchema } from "@/lib/schema/CreateStudentSchema";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import CsvImportSection from "@/components/CsvImportSection";
import { csvRowsToRecords, getCsvValue, parseCsv } from "@/lib/csv";

type StudentGender = "MALE" | "FEMALE" | "OTHER";

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
  const [classOptions, setClassOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const genderOptions: { label: string; value: string }[] = [...genders];

  const form = useForm<z.infer<typeof CreateStudentSchema>>({
    resolver: zodResolver(CreateStudentSchema),
    defaultValues: {
      name: student?.name ?? "",
      rollNo: student?.rollNo ?? "",
      dateOfBirth: student?.dateOfBirth
        ? new Date(student.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: (student?.gender as StudentGender | undefined) ?? undefined,
      email: student?.email ?? "",
      phoneNumber: student?.phoneNumber ?? "",
      classId: student?.classId ?? "",
    },
  });

  // useEffect(() => {
  // 	if (!student) return;

  // 	form.reset({
  // 		name: student.name,
  // 		rollNo: student.rollNo,
  // 		dateOfBirth: student.dateOfBirth
  // 			? new Date(student.dateOfBirth).toISOString().split("T")[0]
  // 			: "",
  // 		gender: student.gender as Gender,
  // 		email: student.email,
  // 		phoneNumber: student.phoneNumber,
  // 		classId: student.classId,
  // 	});
  // }, [student, form]);

  useEffect(() => {
    let mounted = true;

    const loadClasses = async () => {
      setIsLoadingClasses(true);
      try {
        const res = await api.classes.getAll();
        const classes =
          (res?.data?.classes as
            | {
                id: string;
                name: string;
                department?: { symbol?: string | null } | null;
              }[]
            | undefined) ?? [];
        const options = classes.map((classItem) => ({
          value: classItem.id,
          label: classItem.department?.symbol
            ? `${classItem.name}`
            : `${classItem.name}`,
        }));

        if (mounted) setClassOptions(options);
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load classes",
        );
      } finally {
        if (mounted) setIsLoadingClasses(false);
      }
    };

    loadClasses();
    return () => {
      mounted = false;
    };
  }, []);

  const {
    formState: { isSubmitting },
  } = form;

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
          gender: StudentGender;
          classId: string;
        }> = {
          name: values.name as string,
          rollNo: values.rollNo as string,
          dateOfBirth: values.dateOfBirth
            ? (values.dateOfBirth as string)
            : null,
          email: values.email as string,
          phoneNumber: values.phoneNumber as string,
          gender: values.gender as StudentGender,
          classId: values.classId as string,
        };

        const res = await api.students.update(student.id, updateData);

        if (res?.success) {
          router.refresh();
          onClose?.();
          return;
        }
      } else {
        const data = {
          name: values.name as string,
          rollNo: values.rollNo as string,
          dateOfBirth: values.dateOfBirth
            ? (values.dateOfBirth as string)
            : null,
          email: values.email as string,
          phoneNumber: values.phoneNumber as string,
          gender: values.gender as StudentGender,
          classId: values.classId as string,
        };

        const res = await api.students.create(data);

        if (res?.success) {
          router.refresh();
          onClose?.();
          return;
        }
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to save student";

      if (message.includes("Email")) {
        form.setError("email", { message });
      } else if (message.includes("Name")) {
        form.setError("name", { message });
      } else {
        toast.error(message);
      }
    }
  }

  async function handleCsvImport(file: File) {
    const rawText = await file.text();
    const records = csvRowsToRecords(parseCsv(rawText));

    if (records.length === 0) {
      throw new Error("The CSV file does not contain any data rows");
    }

    const classLookup = new Map(
      classOptions.map((option) => [option.value.toLowerCase(), option.value]),
    );
    const classNameLookup = new Map(
      classOptions.map((option) => [
        option.label.trim().toLowerCase(),
        option.value,
      ]),
    );

    const importRows = records.map((record, index) => {
      const rawClassValue = getCsvValue(record, [
        "classId",
        "className",
        "class",
      ]);
      const normalizedClassValue = rawClassValue?.trim().toLowerCase() ?? "";
      const classId =
        classLookup.get(normalizedClassValue) ??
        classNameLookup.get(normalizedClassValue) ??
        rawClassValue;

      const parsed = CreateStudentSchema.safeParse({
        name: getCsvValue(record, ["name", "fullName", "full_name"]),
        rollNo: getCsvValue(record, ["rollNo", "roll_no", "rollnumber"]),
        dateOfBirth: getCsvValue(record, [
          "dateOfBirth",
          "date_of_birth",
          "dob",
        ]),
        gender: getCsvValue(record, ["gender"]),
        email: getCsvValue(record, ["email", "emailAddress"]),
        phoneNumber: getCsvValue(record, [
          "phoneNumber",
          "phone",
          "phone_number",
        ]),
        classId,
      });

      if (!parsed.success) {
        const message = parsed.error.issues[0]?.message ?? "Invalid row";
        throw new Error(`Row ${index + 2}: ${message}`);
      }

      return parsed.data;
    });

    let successCount = 0;
    const failures: string[] = [];

    for (let index = 0; index < importRows.length; index += 1) {
      const row = importRows[index];

      try {
        await api.students.create({
          name: row.name,
          rollNo: row.rollNo,
          dateOfBirth: row.dateOfBirth ?? null,
          email: row.email,
          phoneNumber: row.phoneNumber,
          gender: row.gender as StudentGender,
          classId: row.classId,
        });
        successCount += 1;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to import row";
        failures.push(`Row ${index + 2}: ${message}`);
      }
    }

    router.refresh();

    if (failures.length === 0) {
      toast.success(
        `Imported ${successCount} student${successCount === 1 ? "" : "s"} successfully`,
      );
      onClose?.();
      return;
    }

    toast.error(
      `Imported ${successCount}/${importRows.length} students. ${failures[0]}`,
    );
  }

  const handleCancel = () => {
    if (onClose) {
      onClose();
      return;
    }

    router.back();
  };
  return (
    <div className="flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 w-full"
        >
          {!isEdit ? (
            <CsvImportSection
              title="Import students from CSV"
              description="Use headers name, rollNo, dateOfBirth, gender, email, phoneNumber, classId. You can also use className instead of classId if it matches an existing class name."
              headers={[
                "name",
                "rollNo",
                "dateOfBirth",
                "gender",
                "email",
                "phoneNumber",
                "className",
              ]}
              disabled={isSubmitting || isLoadingClasses}
              onImport={handleCsvImport}
            />
          ) : null}

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
            <div className="rounded-md w-8/12 mt-5">
              <FormSelect
                disabled={isSubmitting || isLoadingClasses}
                form={form}
                name="classId"
                placeholder={
                  isLoadingClasses ? "Loading classes..." : "Select class"
                }
                options={classOptions}
                id="form-rhf-select-class"
                triggerClassName="w-full cursor-pointer"
              />
            </div>

            <div className="rounded-md w-4/12 mt-5">
              <FormSelect
                disabled={isSubmitting}
                form={form}
                name="gender"
                placeholder="Gender"
                options={genderOptions}
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
