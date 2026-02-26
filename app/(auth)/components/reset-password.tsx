"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ResetPasswordSchema } from "@/schema/index.schema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function ResetPasswordForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const form = useForm<z.infer<typeof ResetPasswordSchema>>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
		console.log(values);
		const token = new URLSearchParams(window.location.search).get("token");
		if (!token) {
			setError("Missing reset token");
			return;
		}

		try {
			const res = await api.auth.resetPassword(values.password, token);
			if (res.success) {
				router.push("/");
				toast.success("Update password successful!");
				console.log("Update password successful", res.data);
			} else {
				setError(res.message);
			}
		} catch (err: any) {
			setError(err.message || "Something went wrong");
		}
	}
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="bg-white/10 backdrop-blur-md border-white/20 text-white shadow-xl">
				<CardHeader>
					<CardTitle>Set a new password</CardTitle>
					<CardDescription>
						Enter a new password to rest to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8"
						>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={
														showPassword
															? "text"
															: "password"
													}
													placeholder="Enter your password"
													{...field}
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="absolute right-0 top-0 h-full px-3 py-2 dark:hover:bg-transparent cursor-pointer"
													onClick={() =>
														setShowPassword(
															(prev) => !prev,
														)
													}
												>
													{showPassword ? (
														<EyeOff className="h-4 w-4 text-muted-foreground " />
													) : (
														<Eye className="h-4 w-4 text-muted-foreground " />
													)}
												</Button>
											</div>
										</FormControl>

										<FormMessage />
										{error && (
											<FormMessage className="text-red-500">
												{error}
											</FormMessage>
										)}
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={
														showConfirmPassword
															? "text"
															: "password"
													}
													placeholder="Enter your confirm password"
													{...field}
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="absolute right-0 top-0 h-full px-3 py-2 dark:hover:bg-transparent cursor-pointer"
													onClick={() =>
														setShowConfirmPassword(
															(prev) => !prev,
														)
													}
												>
													{showConfirmPassword ? (
														<EyeOff className="h-4 w-4 text-muted-foreground " />
													) : (
														<Eye className="h-4 w-4 text-muted-foreground " />
													)}
												</Button>
											</div>
										</FormControl>

										<FormMessage />
										{error && (
											<FormMessage className="text-red-500">
												{error}
											</FormMessage>
										)}
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								className="cursor-pointer w-full bg-blue-400 hover:bg-blue-500"
							>
								Update Password
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
