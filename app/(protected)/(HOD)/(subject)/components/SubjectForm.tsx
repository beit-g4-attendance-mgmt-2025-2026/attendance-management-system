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
import { useEffect } from "react";
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
	const schema = (
		subject && isEdit ? SubjectSchema.partial() : SubjectSchema
	).extend({
		year: z.nativeEnum(Year),
		semester: z.nativeEnum(Semester),
	});

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		values: {
			name: subject?.name || "",
			subCode: subject?.subCode || "",
			teacher_name: subject?.user?.fullName || "",
			year: subject?.class?.year as Year,
			semester: subject?.class?.semester as Semester,
		},
	});

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
					teacher_name: values.teacher_name,
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
					teacher_name: values.teacher_name as string,
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
					<FormInput
						form={form}
						name="teacher_name"
						label="Teacher Name"
						placeholder="Enter teacher's username"
						className="w-full"
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
