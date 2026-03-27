"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";

export function DialogCardBtn({
	children,
	triggerName,
	triggerIcon,
	title,
	description,
	contentClassName,
}: {
	children: React.ReactNode;
	triggerName?: string;
	triggerIcon?: React.ReactElement;
	title: string;
	description?: string;
	contentClassName?: string;
}) {
	const [open, setOpen] = useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<form>
				<DialogTrigger asChild>
					<Button className="cursor-pointer text-white bg-sky-600 hover:bg-sky-700 hover:text-white">
						{triggerName}
						{triggerIcon}
					</Button>
				</DialogTrigger>
				<DialogContent
					className={
						contentClassName ?? "sm:max-w-[425px] max-h-[80vh] overflow-y-auto"
					}
				>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					{React.isValidElement(children)
						? React.cloneElement(children as any, {
								onClose: () => setOpen(false),
							})
						: children}
				</DialogContent>
			</form>
		</Dialog>
	);
}
