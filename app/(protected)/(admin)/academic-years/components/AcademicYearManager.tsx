"use client";

import { FormInput } from "@/components/inputs/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import {
	CreateAcademicYearSchema,
	type CreateAcademicYearInput,
} from "@/lib/schema/CreateAcademicYearSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type AcademicYearItem = {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	isActive: boolean;
};

const AcademicYearManager = () => {
	const router = useRouter();
	const [academicYears, setAcademicYears] = useState<AcademicYearItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<CreateAcademicYearInput>({
		resolver: zodResolver(CreateAcademicYearSchema),
		defaultValues: {
			name: "",
			startDate: "",
			endDate: "",
			isActive: false,
		},
	});

	const {
		formState: { isSubmitting },
	} = form;

	const loadAcademicYears = useCallback(async () => {
		try {
			setIsLoading(true);
			const res = await api.academicYears.getAll();
			setAcademicYears(res?.data?.academicYears ?? []);
		} catch (error: any) {
			toast.error(error.message ?? "Failed to load academic years");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadAcademicYears();
	}, [loadAcademicYears]);

	const formatDate = (value: string) =>
		new Date(value).toLocaleDateString("en-GB", {
			year: "numeric",
			month: "short",
			day: "2-digit",
		});

	const onSubmit: SubmitHandler<CreateAcademicYearInput> = async (values) => {
		try {
			const res = await api.academicYears.create({
				...values,
				isActive: values.isActive ?? false,
			});
			if (res?.success) {
				toast.success("Academic year created successfully");
				router.push("/dashboard");
			}
		} catch (error: any) {
			toast.error(error.message ?? "Failed to create academic year");
		}
	};

	return (
		<div className="space-y-6">
			<div className="rounded-2xl border p-4">
				<h2 className="text-lg font-semibold mb-4">
					Create Academic Year
				</h2>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid gap-4 md:grid-cols-2"
					>
						<FormInput
							form={form}
							name="name"
							label="Name"
							placeholder="e.g. 2026-2027"
							disabled={isSubmitting}
						/>
						<div className="md:col-span-2 grid gap-4 md:grid-cols-2">
							<FormInput
								form={form}
								name="startDate"
								label="Start Date"
								type="date"
								disabled={isSubmitting}
							/>
							<FormInput
								form={form}
								name="endDate"
								label="End Date"
								type="date"
								disabled={isSubmitting}
							/>
						</div>

						<label className="md:col-span-2 inline-flex items-center gap-2 text-sm font-medium">
							<input
								type="checkbox"
								checked={form.watch("isActive") ?? false}
								onChange={(e) =>
									form.setValue("isActive", e.target.checked)
								}
								disabled={isSubmitting}
							/>
							Set as active academic year
						</label>

						<div className="md:col-span-2 flex justify-end">
							<Button
								type="submit"
								disabled={isSubmitting}
								className="cursor-pointer text-white bg-sky-600 hover:bg-sky-700 hover:text-white"
							>
								{isSubmitting
									? "Creating..."
									: "Create Academic Year"}
							</Button>
						</div>
					</form>
				</Form>
			</div>

			<div className="rounded-2xl border p-4">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold">
						Academic Year List
					</h2>
					<Button
						type="button"
						variant="outline"
						onClick={loadAcademicYears}
						disabled={isLoading}
						className="cursor-pointer"
					>
						{isLoading ? "Loading..." : "Refresh"}
					</Button>
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Start Date</TableHead>
							<TableHead>End Date</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{academicYears.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="text-center text-gray-500"
								>
									No academic years found.
								</TableCell>
							</TableRow>
						) : (
							academicYears.map((item) => (
								<TableRow key={item.id}>
									<TableCell>{item.name}</TableCell>
									<TableCell>
										{formatDate(item.startDate)}
									</TableCell>
									<TableCell>
										{formatDate(item.endDate)}
									</TableCell>
									<TableCell>
										{item.isActive ? (
											<span className="text-emerald-600 font-medium">
												Active
											</span>
										) : (
											<span className="text-red-500">
												Inactive
											</span>
										)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default AcademicYearManager;
