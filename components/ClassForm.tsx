"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/inputs/FormInput";
import FormSelect from "@/components/inputs/FormSelect";
import { semesters, Years } from "@/constants/index.constants";
import { Semester, Year } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import { CreateClassSchema } from "@/lib/schema/CreateClassSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type ClassFormValues = z.infer<typeof CreateClassSchema>;

const ClassForm = ({
	isEdit = false,
	classData,
	onClose,
}: {
	isEdit: boolean;
	classData?: Partial<ClassFormValues> & { id?: string };
	onClose?: () => void;
}) => {
	const router = useRouter();
	const [teacherOptions, setTeacherOptions] = useState<
		{ label: string; value: string }[]
	>([]);

	const form = useForm<ClassFormValues>({
		resolver: zodResolver(CreateClassSchema),
		defaultValues: {
			name: "",
			semester: undefined,
			year: undefined,
			academicYearId: null,
			userId: null,
		},
	});

	useEffect(() => {
		if (!classData) return;

		form.reset({
			name: classData.name ?? "",
			semester: classData.semester as Semester | undefined,
			year: classData.year as Year | undefined,
			academicYearId: classData.academicYearId ?? null,
			userId: classData.userId ?? null,
		});
	}, [classData, form]);

	useEffect(() => {
		const loadTeachers = async () => {
			try {
				const res = await api.users.getAll();
				const users = res?.data?.users ?? [];
				const teachers = users.map((user: any) => ({
					label: user.fullName,
					value: user.id,
				}));

				setTeacherOptions(teachers);
			} catch (error: any) {
				toast.error(error.message ?? "Failed to load teachers");
			}
		};

		loadTeachers();
	}, []);

	const {
		formState: { isSubmitting },
	} = form;

	async function onSubmit(values: ClassFormValues) {
		try {
			const payload = {
				name: values.name,
				semester: values.semester,
				year: values.year,
				academicYearId: values.academicYearId || null,
				userId: values.userId || null,
			};

			const res =
				isEdit && classData?.id
					? await api.classes.update(classData.id, payload)
					: await api.classes.create(payload);

			if (res?.success) {
				toast.success(
					isEdit
						? "Class updated successfully"
						: "Class created successfully",
				);
				router.refresh();
				onClose?.();
			}
		} catch (error: any) {
			toast.error(error.message ?? "Something went wrong");
		}
	}

	return (
		<div className="flex items-center justify-center">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4 w-full"
				>
					<FormInput
						form={form}
						name="name"
						label="Class Name"
						placeholder="Enter class name"
						className="w-full"
						disabled={isSubmitting}
					/>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<FormSelect
							disabled={isSubmitting}
							form={form}
							name="year"
							placeholder="Year"
							options={Years as any}
							id="form-rhf-select-year"
							triggerClassName="w-full cursor-pointer"
						/>

						<FormSelect
							disabled={isSubmitting}
							form={form}
							name="semester"
							placeholder="Semester"
							options={semesters as any}
							id="form-rhf-select-semester"
							triggerClassName="w-full cursor-pointer"
						/>
					</div>

					<div className="space-y-2">
						<p className="text-sm font-medium">Family Teacher</p>
						<FormSelect
							disabled={isSubmitting}
							form={form}
							name="userId"
							placeholder="Select family teacher (optional)"
							options={teacherOptions}
							id="form-rhf-select-family-teacher"
							triggerClassName="w-full cursor-pointer"
						/>
					</div>

					<div className="flex justify-end gap-2 pt-4">
						<Button
							type="button"
							variant="outline"
							className="cursor-pointer min-w-28"
							onClick={() => onClose?.()}
						>
							Cancel
						</Button>
						<Button
							disabled={isSubmitting}
							type="submit"
							className="cursor-pointer min-w-28 text-white bg-sky-600 hover:bg-sky-700 hover:text-white"
						>
							{isEdit ? "Save Changes" : "Add Class"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default ClassForm;
