import { Button } from "@/components/ui/button";
import DepartmentForm from "../components/DepartmentForm";

const page = () => {
	return (
		<div>
			<header className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Add Department</h1>
				<Button variant={"link"}>Import CSV</Button>
			</header>
			<main className="mt-6">
				<DepartmentForm />
			</main>
		</div>
	);
};

export default page;
