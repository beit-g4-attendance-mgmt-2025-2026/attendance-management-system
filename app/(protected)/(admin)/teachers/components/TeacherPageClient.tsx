"use client";

import { useState } from "react";
import { Paginationn } from "@/components/Pagination";
import TeachersListTable from "./TeachersListTable";
import { TeacherProfileCard } from "./TeacherProfileCard";
import { User } from "@/generated/prisma/client";
import { api } from "@/lib/api";
import { toast } from "sonner";

export interface TeacherPageClientProps {
	initialTeachers: User[];
}

const TeacherPageClient = ({ initialTeachers }: TeacherPageClientProps) => {
	const [teachers, setTeachers] = useState<User[]>(initialTeachers);
	const [selectedTeacher, setSelectedTeacher] = useState<User | null>(
		initialTeachers ? initialTeachers[0] : null,
	);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const handleDelete = async (id: string) => {
		setDeletingId(id);
		try {
			const res = await api.users.delete(id);

			const next = teachers.filter((t) => t.id !== id);
			setTeachers(next);

			if (selectedTeacher?.id === id) {
				setSelectedTeacher(next[0] ?? null);
			}
		} catch (error: any) {
			toast(error.message);
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<main>
			<div className="flex gap-5 w-full">
				<div className=" flex flex-col justify-between">
					<TeachersListTable
						teachers={teachers}
						selectedTeacher={selectedTeacher}
						onSelectTeacher={setSelectedTeacher}
						onDelete={handleDelete}
						deletingId={deletingId}
					/>
					<div>
						<Paginationn />
					</div>
				</div>
				{/* <div className="w-4/12 sticky top-0  h-svh  "> */}
				<TeacherProfileCard teacher={selectedTeacher} />
				{/* </div> */}
			</div>
		</main>
	);
};

export default TeacherPageClient;
