"use server";
import ClassDetailsTable from "@/components/ClassDetailsTable";
import { STUDENTS } from "@/constants/index.constants";

const page = async ({
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;
	return (
		<div className="flex justify-between w-full">
			<ClassDetailsTable students={STUDENTS} />
		</div>
	);
};

export default page;
