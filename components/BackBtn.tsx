"use client";
import { useRouter } from "next/navigation";
import { IoChevronBackSharp } from "react-icons/io5";

const BackBtn = () => {
	const router = useRouter();
	return (
		<IoChevronBackSharp
			className="size-6 mt-1 cursor-pointer"
			onClick={() => router.back()}
		/>
	);
};

export default BackBtn;
