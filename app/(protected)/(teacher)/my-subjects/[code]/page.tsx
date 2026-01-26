"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Form } from "@/components/ui/form";
import FormSelect from "@/components/inputs/FormSelect";
import { IoChevronBackSharp } from "react-icons/io5";
import {
  days,
  months,
  times,
  STUDENTS,
  totalTimes,
} from "@/constants/index.constants";
import { TakeAttendanceSchema } from "@/schema/index.schema";

interface PageProps {
  params: Promise<{ code: string }>;
}

const Page = ({ params }: PageProps) => {
  const paramData = React.use(params);
  const router = useRouter();
  const today = new Date();
  const form = useForm<z.infer<typeof TakeAttendanceSchema>>({
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
    form.setValue("SubjectId", paramData.code);
  }, [paramData.code, form]);

  const totalTimesValue = form.watch("TotalTimes");
  React.useEffect(() => {
    if (!totalTimesValue) return;

    const newTimes: Record<string, string> = {};

    STUDENTS.forEach((student) => {
      newTimes[student.student_id] = totalTimesValue;
    });

    form.setValue("Times", newTimes);
  }, [totalTimesValue, form]);

  function onSubmit(values: z.infer<typeof TakeAttendanceSchema>) {
    console.log("Submitted values", values);
  }

  return (
    <Form {...form}>
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center space-x-3">
          <IoChevronBackSharp
            className="size-6 cursor-pointer"
            onClick={() => router.back()}
          />
          <span className="text-xl font-semibold">{paramData.code}</span>
        </div>
        <div className="flex  items-center space-x-5">
          <div className="flex flex-col min-w-18 space-y-1">
            <span className="text-sm font-medium">Day</span>
            <FormSelect
              form={form}
              name="Day"
              placeholder="Day"
              options={days as any}
            />
          </div>
          <div className="flex flex-col min-w-32 space-y-1">
            <span className="text-sm font-medium">Month</span>
            <FormSelect
              form={form}
              name="Month"
              placeholder="Month"
              options={months as any}
            />
          </div>
          <div className="flex flex-col space-y-1 min-w-20">
            <span className="text-sm font-medium">Total Times</span>
            <FormSelect
              form={form}
              name="TotalTimes"
              placeholder="Total Times"
              options={totalTimes as any}
            />
          </div>
          <Button
            type="submit"
            form="attendance"
            className="bg-sky-600 mt-2 hover:bg-sky-700 text-white h-[38px]">
            Save
          </Button>
        </div>
      </header>

      <form id="attendance" onSubmit={form.handleSubmit(onSubmit)}>
        <input type="hidden" {...form.register("SubjectId")} />
        <Table className="max-w-4xl mx-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Roll-No</TableHead>
              <TableHead className="text-center">Times</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {STUDENTS.map((student, index) => {
              const studentTimes = useWatch({
                control: form.control,
                name: `Times.${student.student_id}`,
              });
              return (
                <TableRow
                  key={student.id}
                  className={`hover:bg-red-50 ${
                    studentTimes === "0" ? "bg-red-50" : ""
                  }`}>
                  <TableCell className="text-center">{index + 1}</TableCell>

                  <TableCell>{student.name}</TableCell>

                  <TableCell className="text-center">
                    {student.student_id}
                  </TableCell>

                  <TableCell>
                    <FormSelect
                      form={form}
                      name={`Times.${student.student_id}`}
                      placeholder="Times"
                      options={times}
                    />
                  </TableCell>

                  <TableCell className="text-center font-semibold">
                    {studentTimes === "0" ? "A" : "P"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </form>
    </Form>
  );
};

export default Page;
