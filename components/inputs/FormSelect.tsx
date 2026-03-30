"use client";

import React from "react";
import { Controller } from "react-hook-form";
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
} from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type Option = { label: string; value: string };

type Props<TFormValues extends FieldValues> = {
	form: UseFormReturn<TFormValues>;
	name: Path<TFormValues>;
	placeholder?: string;
	options: Option[];
	id?: string;
	triggerClassName?: string;
	onValueChange?: (value: string) => void;
	disabled?: boolean;
};

export function FormSelect<TFormValues extends FieldValues>({
	form,
	name,
	placeholder,
	options,
	id,
	triggerClassName,
	disabled,
	onValueChange,
}: Props<TFormValues>) {
	return (
		<FieldGroup>
			<Controller
				name={name}
				control={form.control}
				render={({ field, fieldState }) => (
					<Field
						orientation="responsive"
						data-invalid={fieldState.invalid}
					>
						<Select
							disabled={disabled}
							name={field.name}
							value={(field.value ?? undefined) as any}
							onValueChange={(value) => {
								field.onChange(value);
								onValueChange?.(value);
							}}
						>
							<SelectTrigger
								id={id}
								aria-invalid={fieldState.invalid}
								className={triggerClassName}
							>
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>

							<SelectContent position="item-aligned">
								{options?.map((o) => (
									<SelectItem key={o.value} value={o.value}>
										{o.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<FieldContent>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</FieldContent>
					</Field>
				)}
			/>
		</FieldGroup>
	);
}

export default FormSelect;
