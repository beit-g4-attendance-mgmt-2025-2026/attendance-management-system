"use client";

import React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";

type ConfirmBtnProps = {
	title?: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm: () => void | Promise<void>;
	disabled?: boolean;
	children: React.ReactNode;
};

export function ConfirmBtn({
	title = "Are you absolutely sure?",
	description = "This action cannot be undone.",
	confirmLabel = "Delete",
	cancelLabel = "Cancel",
	onConfirm,
	disabled,
	children,
}: ConfirmBtnProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<span className="contents" aria-disabled={disabled}>
					{children}
				</span>
			</AlertDialogTrigger>

			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
						<Trash2Icon />
					</AlertDialogMedia>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						variant="outline"
						className="cursor-pointer"
					>
						{cancelLabel}
					</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={onConfirm}
						disabled={disabled}
						className="cursor-pointer"
					>
						{confirmLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
