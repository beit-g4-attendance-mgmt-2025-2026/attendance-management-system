"use client";

import UserCard from "@/components/UserCard";
import React from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const CountChart = dynamic(() => import("@/components/CountChart"), {
	ssr: false,
	loading: () => (
		<div className="bg-white rounded-xl w-full h-full p-4 dark:bg-[#1E293B]" />
	),
});

const Attendance = dynamic(() => import("@/components/Attendance"), {
	ssr: false,
	loading: () => (
		<div className="bg-white rounded-xl w-full h-full p-4 dark:bg-[#1E293B]" />
	),
});

const HodRollCallStudents = dynamic(
	() => import("@/components/HodRollCallStudents"),
	{
		ssr: false,
		loading: () => (
			<div className="bg-white rounded-xl w-full h-[260px] p-4 dark:bg-[#1E293B]" />
		),
	},
);

type RollCallStudent = {
	id: string;
	rollNo: string;
	name: string;
	year: string;
	semester: string;
	rollCallPercent: number;
	class: {
		name: string;
	} | null;
};

const HodDashboard = () => {
	const [counts, setCounts] = React.useState({
		students: 0,
		teachers: 0,
		subjects: 0,
		maleStudents: 0,
		femaleStudents: 0,
		otherStudents: 0,
	});
	const [monthlyAttendance, setMonthlyAttendance] = React.useState<
		{ name: string; present: number; absent: number }[]
	>([]);
	const [rollCallStudents, setRollCallStudents] = React.useState<
		RollCallStudent[]
	>([]);
	const [isLoading, setIsLoading] = React.useState(false);

	React.useEffect(() => {
		let isMounted = true;

		const loadStats = async () => {
			try {
				setIsLoading(true);
				const res = await api.dashboard.getHodStats();
				const stats = res?.data?.stats;
				const attendance = res?.data?.monthlyAttendance ?? [];
				const students = (res?.data?.rollCallStudents ?? []) as RollCallStudent[];
				if (isMounted && res?.success && stats) {
					setCounts(stats);
					setMonthlyAttendance(attendance);
					setRollCallStudents(students);
				}
			} catch (error: unknown) {
				toast.error(
					error instanceof Error
						? error.message
						: "Failed to load dashboard stats",
				);
			} finally {
				if (isMounted) setIsLoading(false);
			}
		};

		loadStats();
		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div className="w-full ">
			<div className="flex gap-4 w-full flex-wrap">
				<UserCard
					type="students"
					count={isLoading ? "..." : String(counts.students)}
				/>
				<UserCard
					type="teachers"
					count={isLoading ? "..." : String(counts.teachers)}
				/>
				<UserCard
					type="subjects"
					count={isLoading ? "..." : String(counts.subjects)}
				/>
			</div>
			{/* Middle Charts */}
			<div className="flex gap-4 flex-col lg:flex-row mt-5">
				<div className="w-full lg:w-1/3 h-[450px]">
					<CountChart
						maleCount={counts.maleStudents}
						femaleCount={counts.femaleStudents}
						otherCount={counts.otherStudents}
						totalCount={counts.students}
					/>
				</div>
				<div className="w-full lg:w-2/3 h-[450px]">
					<Attendance data={monthlyAttendance} />
				</div>
			</div>
			<div className="mt-4">
				<HodRollCallStudents students={rollCallStudents} />
			</div>
		</div>
	);
};

export default HodDashboard;
