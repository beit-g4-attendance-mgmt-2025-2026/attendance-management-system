import { Button } from "@/components/ui/button";
import StudentForm from "../components/StudentForm";

const page = () => {
	return (
		<div>
			<div className="flex justify-between items-center mb-10">
				<span className="text-2xl">Add Students</span>
				<Button
					variant={"link"}
					className="text-[#2D88D4] underline cursor-pointer"
				>
					Import CSV
				</Button>
			</div>
			<StudentForm />
		</div>
	);
};

export default page;
