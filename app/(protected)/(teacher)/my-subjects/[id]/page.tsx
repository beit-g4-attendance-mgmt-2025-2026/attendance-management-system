"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { months, STUDENTS } from "@/constants/index.constants";
import { TakeAttendanceSchema } from "@/schema/index.schema";
import type { TakeAttendanceFormValues } from "./components/types";

const SubjectDetailHeader = dynamic(
	() => import("./components/SubjectDetailHeader"),
	{
		ssr: false,
		loading: () => (
			<div className="h-[72px] rounded-lg border bg-muted/20 animate-pulse" />
		),
	},
);

const SubjectAttendanceTableSection = dynamic(
	() => import("./components/SubjectAttendanceTableSection"),
	{
		ssr: false,
		loading: () => (
			<div className="h-[420px] rounded-lg border bg-muted/20 animate-pulse" />
		),
	},
);

interface PageProps {
	params: Promise<{ id: string }>;
}

const Page = ({ params }: PageProps) => {
	const { id } = React.use(params);
	const router = useRouter();
	const today = new Date();

	const form = useForm<TakeAttendanceFormValues>({
		resolver: zodResolver(TakeAttendanceSchema),
		defaultValues: {
			SubjectId: "",
			Day: today.getDate().toString(),
			Month: months[today.getMonth()].value,
			TotalTimes: "",
			Times: {},
		},
	});

	React.useEffect(() => {
		form.setValue("SubjectId", id);
	}, [id, form]);

	const totalTimesValue = form.watch("TotalTimes");
	React.useEffect(() => {
		if (!totalTimesValue) return;

		const nextTimes: Record<string, string> = {};
		STUDENTS.forEach((student) => {
			nextTimes[student.student_id] = totalTimesValue;
		});
		form.setValue("Times", nextTimes);
	}, [totalTimesValue, form]);

	function onSubmit(values: TakeAttendanceFormValues) {
		console.log("Submitted values", values);
	}

	return (
		<Form {...form}>
			<SubjectDetailHeader
				subjectCode={id}
				form={form}
				onBack={() => router.back()}
			/>
			<SubjectAttendanceTableSection form={form} onSubmit={onSubmit} />
		</Form>
	);
};

export default Page;
