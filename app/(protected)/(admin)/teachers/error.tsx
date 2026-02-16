"use client";

import { Button } from "@/components/ui/button";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
			<h2 className="text-destructive font-bold text-2xl">
				Error Occurred!
			</h2>
			<p className="text-gray-500">{error.message}</p>
			<Button
				variant={"destructive"}
				className="cursor-pointer"
				onClick={() => reset()} // retry do not refresh the page but re-render the component
			>
				Try Again
			</Button>
		</div>
	);
}
