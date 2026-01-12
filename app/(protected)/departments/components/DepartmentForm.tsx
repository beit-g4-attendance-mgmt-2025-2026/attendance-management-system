"use client";

import { Form } from "@/components/ui/form";
import FormInput from "@/components/inputs/FormInput";
import { Button } from "@/components/ui/button";
import { DepartmentSchema } from "@/schema/index.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const DepartmentForm = () => {
	const router = useRouter();

	const form = useForm<z.infer<typeof DepartmentSchema>>({
		resolver: zodResolver(DepartmentSchema),
		defaultValues: {
			name: "",
			short_term: "",
			image: "",
		},
	});

	function onSubmit(values: z.infer<typeof DepartmentSchema>) {
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
						name="short_term"
						label="Short Term"
						placeholder="Enter department short term"
						className="w-full min-w-[140px]"
					/>
					<FormInput
						form={form}
						name="image"
						label="Logo URL"
						placeholder="Enter department logo url"
						className="w-full min-w-[140px]"
					/>

					{/* btn */}
					<div className="flex gap-3 items-center justify-end mt-10">
						<Button
							type="button"
							variant="outline"
							className="cursor-pointer min-w-36"
							onClick={handleCancel}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="cursor-pointer min-w-36 text-white"
						>
							Add Department
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default DepartmentForm;
