import { Button } from "@/components/ui/button";
import TeacherForm from "../components/TeacherForm";

const page = () => {
	return (
		<div>
			<div className="flex justify-between items-center mb-10">
				<span className="text-2xl">Add Teachers</span>
				<Button
					variant={"link"}
					className="text-[#2D88D4] underline cursor-pointer"
				>
					Import CSV
				</Button>
			</div>

			<TeacherForm />
		</div>
	);
};

export default page;
