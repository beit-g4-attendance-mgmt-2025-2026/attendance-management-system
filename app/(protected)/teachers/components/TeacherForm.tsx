"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/inputs/FormInput";
import { TeacherSchema } from "@/schema/index.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import z from "zod";
import FormSelect from "@/components/inputs/FormSelect";
import { departments, genders, roles } from "@/constants/index.constants";

const TeacherForm = () => {
	const router = useRouter();

	const form = useForm<z.infer<typeof TeacherSchema>>({
		resolver: zodResolver(TeacherSchema),
		defaultValues: {
			full_name: "",
			username: "",
			email: "",
			password: "",
			phone: "",
			gender: undefined as any,
			role: undefined as any,
			department: undefined as any,
		},
	});

	function onSubmit(values: z.infer<typeof TeacherSchema>) {
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
						name="full_name"
						label="Full Name"
						placeholder="Enter full name"
					/>

					<FormInput
						form={form}
						name="username"
						label="Username"
						placeholder="Enter username"
					/>

					<FormInput
						form={form}
						name="email"
						label="Email address"
						placeholder="Enter email address"
						className="w-full"
					/>

					<div className="flex gap-6">
						<div className=" w-8/12">
							<FormInput
								form={form}
								name="password"
								label="Password"
								placeholder="Enter password"
								className="w-full"
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
					</div>
					<div className="flex gap-6">
						<div className=" w-8/12">
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
								name="department"
								placeholder="Department"
								options={departments as any}
								id="form-rhf-select-department"
								triggerClassName="min-w-[120px] cursor-pointer"
							/>
						</div>
					</div>

					<div className="flex gap-3 items-center justify-end mt-10">
						<Button
							type="submit"
							className="cursor-pointer min-w-36"
						>
							Add Teacher
						</Button>
						<Button
							type="button"
							variant="outline"
							className="cursor-pointer min-w-36"
							onClick={handleCancel}
						>
							Cancel
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default TeacherForm;
