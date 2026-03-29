"use client";
import SearchInput from "@/components/inputs/SearchInput";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import DepartmentsListTable from "./components/DepartmentsListTable";
import Link from "next/link";
import { DepartmentTableItem } from "@/types/index.types";
import fetchHandler from "@/lib/fetchHandler";

const Page = () => {
	const [departments, setDepartments] = useState<DepartmentTableItem[]>([]);
	const [loading, setLoading] = useState(true);

	const loadDepartments = async () => {
		const res = await fetchHandler(
			"http://localhost:3000/api/departments/",
			{
				method: "GET",
			},
		);

		if (res?.success) {
			setDepartments(
				res.data.formattedDepartment as DepartmentTableItem[],
			);
		}

		setLoading(false);
	};

	useEffect(() => {
		loadDepartments();
	}, []);

	return (
		<div>
			<header className="flex justify-between items-center mb-6">
				<SearchInput
					placeholder="Search department by name"
					className="bg-gray-200 rounded-2xl  dark:bg-[#172139]"
				/>
				<div className="flex gap-3">
					<Button variant={"link"} className="text-sky-600">
						Export CSV
					</Button>
					<Button className="text-white bg-sky-600 hover:bg-sky-700 hover:text-white">
						<Link href={"departments/add"}>Add Department</Link>
					</Button>
				</div>
			</header>

			<main className="flex items-center justify-center max-w-5xl mx-auto">
				{loading ? (
					<div className="text-gray-500">Loading departments...</div>
				) : departments.length > 0 ? (
					<DepartmentsListTable
						departments={departments}
						onDeleted={(id) =>
							setDepartments((prev) =>
								prev.filter((d) => d.id !== id),
							)
						}
					/>
				) : (
					<div className="text-gray-500">No departments found.</div>
				)}
			</main>
		</div>
	);
};

export default Page;
