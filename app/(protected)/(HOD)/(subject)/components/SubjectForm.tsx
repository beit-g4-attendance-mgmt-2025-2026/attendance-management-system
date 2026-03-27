"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/inputs/FormInput";
import { SubjectSchema } from "@/schema/index.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import z from "zod";
import FormSelect from "@/components/inputs/FormSelect";
import { Years, semesters } from "@/constants/index.constants";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { SubjectWithDetails } from "@/lib/actions/GetSubjects.actions";
import { Semester, Year } from "@/generated/prisma/enums";

const SubjectForm = ({
	isEdit = false,
	subject,
	onClose,
}: {
	isEdit: boolean;
	subject?: SubjectWithDetails | null;
	onClose?: () => void;
}) => {
	const router = useRouter();
	const [teacherOptions, setTeacherOptions] = useState<
		{ label: string; value: string }[]
	>([]);
	const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
	const schema = (
		subject && isEdit ? SubjectSchema.partial() : SubjectSchema
	).extend({
		year: z.nativeEnum(Year),
		semester: z.nativeEnum(Semester),
	});

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			subCode: "",
			userId: "",
			year: undefined as any,
			semester: undefined as any,
		},
	});
	useEffect(() => {
		if (!subject) return;
		form.reset({
			name: subject.name,
			subCode: subject.subCode,
			userId: subject.user?.id ?? "",
			year: subject.class?.year as Year,
			semester: subject.class?.semester as Semester,
		});
	}, [subject, form]);

	useEffect(() => {
		let mounted = true;
		const loadTeachers = async () => {
			setIsLoadingTeachers(true);
			try {
				const res = await api.users.getAll();
				const users = res?.data?.users ?? [];
				const options = users
					.filter((user: any) => user.role === "TEACHER")
					.map((user: any) => ({
						value: user.id,
						label: user.department?.symbol
							? `${user.fullName} (${user.department.symbol})`
							: user.fullName,
					}));

				if (mounted) setTeacherOptions(options);
			} catch (error: any) {
				toast.error(error.message ?? "Failed to load teachers");
			} finally {
				if (mounted) setIsLoadingTeachers(false);
			}
		};

		loadTeachers();
		return () => {
			mounted = false;
		};
	}, []);

	const {
		formState: { isSubmitting },
	} = form;

	async function onSubmit(values: z.infer<typeof schema>) {
		try {
			if (isEdit && subject) {
				// update payload (remove empty strings)
				const updateData = {
					name: values.name,
					subCode: values.subCode,
					userId: values.userId,
					year: values.year,
					semester: values.semester,
				};

				const res = await api.subjects.update(subject.id, updateData);
				console.log("updated subject: ", res);
				if (res?.success) {
					router.refresh();
					onClose?.();
					toast.success("Subject updated successfully!");
					return;
				}
			} else {
				const data = {
					name: values.name as string,
					subCode: values.subCode as string,
					userId: values.userId as string,
					year: values.year,
					semester: values.semester,
				};

				const res = await api.subjects.create(data);
				console.log("create user: ", res);
				if (res?.success) {
					router.refresh();
					onClose?.();
					toast.success("Subject Created Successfully!");
					return;
				}
			}
		} catch (error: any) {
			const message = error.message;

			// if (message.includes("Email")) {
			// 	form.setError("email", { message });
			// } else if (message.includes("Username")) {
			// 	form.setError("username", { message });
			// } else {
			toast.error(message);
			// }
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
					className="space-y-5 "
				>
					<FormInput
						form={form}
						name="name"
						label="Name"
						placeholder="Enter subject name"
						className="w-full"
					/>
					<FormInput
						form={form}
						name="subCode"
						label="Code"
						placeholder="Enter subject code"
						className="w-full"
					/>
					<FormSelect
						form={form}
						name="userId"
						placeholder={
							isLoadingTeachers
								? "Loading teachers..."
								: "Select teacher"
						}
						options={teacherOptions}
						id="form-rhf-select-teacher"
						disabled={isSubmitting || isLoadingTeachers}
						triggerClassName="w-full cursor-pointer"
					/>
					<FormSelect
						form={form}
						name="semester"
						placeholder="Semester"
						options={semesters}
						id="form-rhf-select-semester"
						triggerClassName="min-w-[120px] cursor-pointer"
					/>
					<FormSelect
						form={form}
						name="year"
						placeholder="Year"
						options={Years}
						id="form-rhf-select-year"
						triggerClassName="min-w-[120px] cursor-pointer"
					/>

					{/* btn */}
					<div className="flex gap-3 items-center justify-end mt-10">
						<Button
							type="button"
							variant="destructive"
							className="cursor-pointer min-w-36"
							onClick={handleCancel}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="cursor-pointer min-w-36 text-white bg-sky-600 hover:bg-sky-700 hover:text-white"
						>
							{isEdit ? "Update" : "Submit"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default SubjectForm;
