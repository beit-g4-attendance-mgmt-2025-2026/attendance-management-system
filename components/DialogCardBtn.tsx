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
import React from "react";

export function DialogCardBtn({
	children,
	triggerName,
	title,
	description,
}: {
	children: React.ReactNode;
	triggerName: string;
	title: string;
	description?: string;
}) {
	return (
		<Dialog>
			<form>
				<DialogTrigger asChild>
					<Button className="cursor-pointer text-white bg-sky-600 hover:bg-sky-700 hover:text-white">
						{triggerName}
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					{children}
					{/* <div className="grid gap-4">
						<div className="grid gap-3">
							<Label htmlFor="name-1">Name</Label>
							<Input
								id="name-1"
								name="name"
								defaultValue="Pedro Duarte"
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="username-1">Username</Label>
							<Input
								id="username-1"
								name="username"
								defaultValue="@peduarte"
							/>
						</div>
					</div> */}
					{/* <DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button type="submit">Save changes</Button>
					</DialogFooter> */}
				</DialogContent>
			</form>
		</Dialog>
	);
}
