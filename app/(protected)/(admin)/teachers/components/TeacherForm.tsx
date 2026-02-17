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
import { TeacherSchema } from "@/schema/index.schema";
import { api } from "@/lib/api";

import { toast } from "sonner";
import { Gender, Role, User } from "@/generated/prisma/client";
import { useEffect } from "react";

const TeacherForm = ({
	isEdit = false,
	teacher,
}: {
	isEdit: boolean;
	teacher?: User | null;
}) => {
	const router = useRouter();
	const schema = teacher && isEdit ? TeacherSchema.partial() : TeacherSchema;
	if (teacher && isEdit) console.log(teacher);

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
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
	useEffect(() => {
		if (!teacher) return;

		form.reset({
			fullName: teacher.fullName,
			username: teacher.username,
			email: teacher.email,
			phoneNumber: teacher.phoneNumber,
			gender: teacher.gender,
		});
	}, [teacher, form]);

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
					// role: Role;
				}> = {
					fullName: values.fullName as string,
					username: values.username as string,
					email: values.email as string,
					phoneNumber: values.phoneNumber as string,
					gender: values.gender as Gender,
					// role: values.role as Role,
				};

				const res = await api.users.update(teacher.id, updateData);
				console.log("updated User: ", res);
				if (res?.success) {
					window.location.reload();
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
				console.log("create user: ", res);
				if (res?.success) {
					window.location.reload();
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
									placeholder={
										isEdit ? "••••••••" : "Enter password"
									}
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
								disabled={isSubmitting || isEdit}
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
