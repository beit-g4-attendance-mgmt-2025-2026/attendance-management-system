"use client";

import React from "react";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

type Props<TFormValues extends FieldValues> = {
	form: UseFormReturn<TFormValues>;
	name: Path<TFormValues>;
	label: string;
	placeholder?: string;
	type?: string;
	className?: string;
	inputClassName?: string;
};

export function FormInput<TFormValues extends FieldValues>({
	form,
	name,
	label,
	placeholder,
	type = "text",
	className,
	inputClassName,
}: Props<TFormValues>) {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input
							{...field}
							placeholder={placeholder}
							type={type}
							className={inputClassName}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export default FormInput;
