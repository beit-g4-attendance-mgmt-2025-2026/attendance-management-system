"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/inputs/FormInput";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import z from "zod";
import FormSelect from "@/components/inputs/FormSelect";
import { departments, genders, roles } from "@/constants/index.constants";
import fetchHandler from "@/lib/fetchHandler";
import { TeacherSchema } from "@/schema/index.schema";

const TeacherForm = ({ isEdit = false }: { isEdit: boolean }) => {
	const router = useRouter();

	const form = useForm<z.infer<typeof TeacherSchema>>({
		resolver: zodResolver(TeacherSchema),
		defaultValues: {
			fullName: "",
			username: "",
			email: "",
			password: "",
			phoneNumber: "",
			gender: genders[0].value,
			role: roles[2].value,
			departmentName: undefined as any,
		},
	});

	async function onSubmit(values: z.infer<typeof TeacherSchema>) {
		// Do something with the form values.
		console.log("Form submitted:");
		console.log(values);
		try {
			const res = await fetchHandler(
				"http://localhost:3000/api/teachers",
				{
					method: "POST",
					body: JSON.stringify({
						fullName: values.fullName,
						username: values.username,
						email: values.email,
						password: values.password,
						phoneNumber: values.phoneNumber,
						gender: values.gender,
						role: values.role,
						departmentName: values.departmentName,
						resetPasswordToken: "",
						resetPasswordExpireAt: null,
					}),
				},
			);
			console.log("create user: ", res);
		} catch (error: unknown) {
			console.log(error);
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
								name="phoneNumber"
								label="Phone number"
								placeholder="Enter phone number"
								className="w-full"
							/>
						</div>
						<div className="rounded-md w-4/12 mt-5">
							<FormSelect
								form={form}
								name="departmentName"
								placeholder="Department"
								options={departments as any}
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
