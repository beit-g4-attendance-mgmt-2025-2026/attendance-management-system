"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/inputs/FormInput";
import { ClassSchema } from "@/schema/index.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import z from "zod";
import FormSelect from "@/components/inputs/FormSelect";
import {
	acedamicYears,
	semesters,
	teacher_name_for_form_select,
} from "@/constants/index.constants";

const ClassForm = ({ isEdit = false }: { isEdit: boolean }) => {
	const router = useRouter();

	const form = useForm<z.infer<typeof ClassSchema>>({
		resolver: zodResolver(ClassSchema),
		defaultValues: {
			name: "",
			teacher_name: "",
			acedamic_year: undefined as any,
			semester: undefined as any,
		},
	});

	function onSubmit(values: z.infer<typeof ClassSchema>) {
		// Do something with the form values.
		console.log("Form submitted:");
		console.log(values);
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
						placeholder="Enter class name"
						className="w-full"
					/>
					<FormInput
						form={form}
						name="teacher_name"
						label="Family teacher"
						placeholder="Enter teacher's username"
						className="w-full"
					/>

					<FormSelect
						form={form}
						name="acedamic_year"
						placeholder="Year"
						options={acedamicYears as any}
						id="form-rhf-select-acedamic-year"
						triggerClassName="min-w-[120px] cursor-pointer"
					/>

					<FormSelect
						form={form}
						name="semester"
						placeholder="Semester"
						options={semesters as any}
						id="form-rhf-select-semester"
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

export default ClassForm;
