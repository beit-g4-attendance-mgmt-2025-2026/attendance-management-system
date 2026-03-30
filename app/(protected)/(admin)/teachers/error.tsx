"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();

	const handleRetry = () => {
		startTransition(() => {
			reset();
			router.refresh();
		});
	};
	return (
		<div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
			<h2 className="text-destructive font-bold text-2xl">
				Error Occurred!
			</h2>
			<p className="text-gray-500">{error.message}</p>
			<Button
				variant={"destructive"}
				className="cursor-pointer"
				onClick={handleRetry} // retry do not refresh the page but re-render the component
			>
				Try Again
			</Button>
		</div>
	);
}
