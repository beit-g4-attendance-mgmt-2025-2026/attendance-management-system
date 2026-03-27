"use client";

import { Button } from "@/components/ui/button";
import FormSelect from "@/components/inputs/FormSelect";
import { IoChevronBackSharp } from "react-icons/io5";
import { days, months, totalTimes } from "@/constants/index.constants";
import type { UseFormReturn } from "react-hook-form";
import type { TakeAttendanceFormValues } from "./types";

type Props = {
	subjectCode: string;
	form: UseFormReturn<TakeAttendanceFormValues>;
	onBack: () => void;
};

const SubjectDetailHeader = ({ subjectCode, form, onBack }: Props) => {
	return (
		<header className="flex justify-between items-center mb-10">
			<div className="flex items-center space-x-3">
				<IoChevronBackSharp
					className="size-6 cursor-pointer"
					onClick={onBack}
				/>
				<span className="text-xl font-semibold">{subjectCode}</span>
			</div>
			<div className="flex items-center space-x-5">
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
					className="bg-sky-600 mt-2 hover:bg-sky-700 text-white h-[38px]"
				>
					Save
				</Button>
			</div>
		</header>
	);
};

export default SubjectDetailHeader;
