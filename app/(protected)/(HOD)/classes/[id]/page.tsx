"use server";
import ClassDetailsTable from "@/components/ClassDetailsTable";
import { GetClassById } from "@/lib/actions/GetClassById";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const page = async ({
	params,
	searchParams,
}: {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
	searchParams: Promise<{
		[key: string]: string | undefined;
	}>;
}) => {
	const { id } = await params;
	const { page, pageSize, search } = await searchParams;
	const currentPage = Number(page) || 1;
	const currentPageSize = Number(pageSize) || 10;
	const { data } = await GetClassById(id, {
		page: currentPage,
		pageSize: currentPageSize,
		search: search || "",
	});
	return (
		<div className="w-full space-y-6">
			<div className="flex items-center gap-3">
				<Link href="/classes">
					<Button
						variant="outline"
						size="icon"
						className="cursor-pointer"
					>
						<ArrowLeft className="size-4" />
					</Button>
				</Link>
				<div>
					<h1 className="text-xl font-semibold">
						{data?.name ?? "Class Details"}
					</h1>
					<p className="text-sm text-muted-foreground">
						View and manage students in this class
					</p>
				</div>
			</div>
			<ClassDetailsTable
				students={data?.students ?? []}
				page={currentPage}
				pageSize={currentPageSize}
				total={data?.total ?? 0}
			/>
		</div>
	);
};

export default page;
