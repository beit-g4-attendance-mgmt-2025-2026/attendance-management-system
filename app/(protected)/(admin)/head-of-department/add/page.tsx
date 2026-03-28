"use client";
import { Button } from "@/components/ui/button";
import TeacherForm from "../../teachers/components/TeacherForm";
import { IoChevronBackSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";

const page = () => {
	const router = useRouter();
	return (
		<div>
			<header className="flex justify-between items-center">
				<div className="flex items-center space-x-3">
					<IoChevronBackSharp
						className="size-6 mt-1 cursor-pointer"
						onClick={() => router.back()}
					/>
					<span className="text-2xl">Add Head of Department</span>
				</div>
				<Button variant={"link"} className="text-sky-600">
					Import CSV
				</Button>
			</header>
			<main className="mt-6 max-w-3xl mx-auto">
				<TeacherForm isEdit={false} />
			</main>
		</div>
	);
};

export default page;
