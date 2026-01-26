"use client";
import { Button } from "@/components/ui/button";
import TeacherForm from "../../teachers/components/TeacherForm";
import { IoChevronBackSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";

const page = () => {
	const router = useRouter();
	return (
		<div>
			<div className="flex justify-between items-center mb-10">
				<div className="flex items-center space-x-3">
					<IoChevronBackSharp
						className="size-6 mt-1 cursor-pointer"
						onClick={() => router.back()}
					/>

					<span className="text-2xl">Add Head Of Department</span>
				</div>
				<Button
					variant={"link"}
					className="text-[#2D88D4] underline cursor-pointer"
				>
					Import CSV
				</Button>
			</div>
			<main>
				<TeacherForm isEdit={false} />
			</main>
		</div>
	);
};

export default page;
