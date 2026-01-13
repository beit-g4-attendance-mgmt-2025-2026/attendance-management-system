"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/inputs/FormInput";
import { StudentSchema } from "@/schema/index.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import z from "zod";
import FormSelect from "@/components/inputs/FormSelect";
import {
	acedamicYears,
	departments,
	genders,
	semesters,
} from "@/constants/index.constants";

const StudentForm = () => {
	const router = useRouter();

	const form = useForm<z.infer<typeof StudentSchema>>({
		resolver: zodResolver(StudentSchema),
		defaultValues: {
			name: "",
			phone: "",
			email: "",
			role_no: "",
			gender: undefined as any,
			department: undefined as any,
			acedamic_year: undefined as any,
			semester: undefined as any,
		},
	});

	function onSubmit(values: z.infer<typeof StudentSchema>) {
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
					className="space-y-5 w-2xl"
				>
					<FormInput
						form={form}
						name="name"
						label="Name"
						placeholder="Enter student name"
						className="w-full"
					/>
					<FormInput
						form={form}
						name="email"
						label="Email address"
						placeholder="Enter email address"
						className="w-full"
					/>

					<div className="flex gap-6">
						<div className=" w-8/16">
							<FormInput
								form={form}
								name="role_no"
								label="Role No."
								placeholder="Enter role number"
								className="w-full min-w-[140px]"
							/>
						</div>
						<div className="rounded-md w-4/12 mt-5">
							<FormSelect
								form={form}
								name="gender"
								placeholder="Gender"
								options={genders as any}
								id="form-rhf-select-gender"
								triggerClassName="min-w-[120px] cursor-pointer"
							/>
						</div>
						<div className="rounded-md w-4/12 mt-5">
							<FormSelect
								form={form}
								name="department"
								placeholder="Department"
								options={departments as any}
								id="form-rhf-select-department"
								triggerClassName="min-w-[120px] cursor-pointer"
							/>
						</div>
					</div>
					<div className="flex gap-6">
						<div className=" w-8/16">
							<FormInput
								form={form}
								name="phone"
								label="Phone number"
								placeholder="Enter phone number"
								className="w-full"
							/>
						</div>
						<div className="rounded-md w-4/12 mt-5">
							<FormSelect
								form={form}
								name="acedamic_year"
								placeholder="Acedamic"
								options={acedamicYears as any}
								id="form-rhf-select-acedamic"
								triggerClassName="min-w-[120px] cursor-pointer"
							/>
						</div>
						<div className="rounded-md w-4/12 mt-5">
							<FormSelect
								form={form}
								name="semester"
								placeholder="Semester"
								options={semesters as any}
								id="form-rhf-select-semester"
								triggerClassName="min-w-[120px] cursor-pointer"
							/>
						</div>
					</div>
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
							Add Student
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default StudentForm;
