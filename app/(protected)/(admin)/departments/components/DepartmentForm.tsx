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
import { useEffect, useState } from "react";

type DepartmentFormValues = z.infer<typeof DepartmentSchema>;
type Props = {
	departmentId?: string;
	isEdit?: boolean;
	redirectTo?: string;
};

const DepartmentForm = ({ departmentId, isEdit, redirectTo }: Props) => {
	const router = useRouter();
	const [submitting, setSubmitting] = useState(false);
	const [initialData, setInitialData] = useState<DepartmentFormValues | null>(
		null,
	);
	const [loading, setLoading] = useState(isEdit);

	const form = useForm<z.infer<typeof DepartmentSchema>>({
		resolver: zodResolver(DepartmentSchema),
		defaultValues: initialData || {
			name: "",
			symbol: "",
			logo: null,
		},
	});
	useEffect(() => {
		if (isEdit && departmentId) {
			(async () => {
				try {
					const res = await fetchHandler(
						`/api/departments/${departmentId}`,
					);
					if (res?.success) {
						const dept = res.data.department;
						setInitialData(dept);

						form.reset({
							name: dept.name || "",
							symbol: dept.symbol || "",
							logo: null,
						});
					}
				} catch (error) {
					toast.error("Failed to load department");
				} finally {
					setLoading(false);
				}
			})();
		}
	}, [isEdit, departmentId, form]);

	const onSubmit = async (values: DepartmentFormValues) => {
		if (submitting) return;
		setSubmitting(true);
		try {
			const formData = new FormData();
			formData.append("name", values.name);
			formData.append("symbol", values.symbol);
			if (values.logo) formData.append("logo", values.logo);

			const res = await fetch(
				isEdit
					? `/api/departments/${departmentId}`
					: "/api/departments",
				{
					method: isEdit ? "PUT" : "POST",
					body: formData,
				},
			);

			const data = await res.json();
			if (res.ok) {
				toast.success(
					`Department ${isEdit ? "updated" : "added"} successfully`,
				);
				if (!isEdit && redirectTo) {
					router.push(redirectTo);
					return;
				}

				router.back();
			} else {
				toast.error(data?.message || "Failed to save department");
			}
		} catch (error: any) {
			toast.error(error.message || "Something went wrong");
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancel = () => router.back();
	if (loading) {
		return (
			<div className="flex justify-center items-center h-64 text-gray-500">
				Loading department...
			</div>
		);
	}
	return (
		<div className="flex items-center justify-center">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-5 w-xl"
				>
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
								<label className="block mb-1 font-medium">
									Logo
								</label>
								<input
									type="file"
									accept="image/*"
									onChange={(e) =>
										field.onChange(
											e.target.files?.[0] || null,
										)
									}
									className="cursor-pointer text-sky-600"
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
							className="min-w-36 cursor-pointer"
							onClick={handleCancel}
						>
							Cancel
						</Button>
						<Button
							disabled={submitting}
							type="submit"
							className="min-w-36 text-white bg-sky-600 hover:bg-sky-700 cursor-pointer"
						>
							{isEdit ? "Update" : "Add"} Department
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default DepartmentForm;
