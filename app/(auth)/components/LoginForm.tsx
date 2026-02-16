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
import { LoginSchema } from "@/schema/index.schema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import fetchHandler from "@/lib/fetchHandler";
import { toast } from "sonner";

type LoginFormProps = React.ComponentProps<"div"> & {
	url: string;
};

export function LoginForm({ url, className, ...props }: LoginFormProps) {
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof LoginSchema>) {
		const res = await fetchHandler(url, {
			method: "POST",
			body: JSON.stringify(values),
		});

		if (res.success) {
			router.push("/dashboard");
			toast.success("Login successful!");
			console.log("Login successful", res.data);
		} else {
			setError(res.message);
		}
	}
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="bg-white/10 backdrop-blur-md border-white/20 text-white shadow-xl">
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your username below to login to your account
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
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your username"
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
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
							<Button
								type="submit"
								className="cursor-pointer w-full bg-blue-400 hover:bg-blue-500"
							>
								Submit
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
