"use client";
import Image from "next/image";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

type AttendanceItem = {
	name: string;
	present: number;
	absent: number;
};

const Attendance = ({ data }: { data: AttendanceItem[] }) => {
	const chartData = data.map((item) => {
		const total = item.present + item.absent;
		const presentPercent =
			total > 0 ? Number(((item.present / total) * 100).toFixed(1)) : 0;
		const absentPercent =
			total > 0 ? Number(((item.absent / total) * 100).toFixed(1)) : 0;

		return {
			...item,
			presentPercent,
			absentPercent,
		};
	});

	return (
		<div className="bg-white rounded-lg p-4 h-full dark:bg-[#1E293B]">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-lg font-semibold">
					Monthly Attendance (%)
				</h1>
				<Image src="/moreDark.png" alt="" width={20} height={20} />
			</div>

			<div className="h-[370px]">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={chartData}
						margin={{
							top: 5,
							right: 8,
							left: 0,
							bottom: 5,
						}}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="var(--chart-grid)"
							vertical={false}
						/>
						<XAxis
							dataKey="name"
							axisLine={false}
							tickLine={false}
							tick={{ fill: "var(--chart-text)", fontSize: 12 }}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tick={{ fill: "var(--chart-text)", fontSize: 12 }}
							domain={[0, 100]}
							tickFormatter={(value) => `${value}%`}
						/>
						<Tooltip
							contentStyle={{
								borderRadius: "10px",
								borderColor: "lightgray",
							}}
							formatter={(value, name) => [`${value}%`, name]}
						/>
						<Legend
							align="center"
							verticalAlign="bottom"
							wrapperStyle={{
								paddingTop: "20px",
								paddingBottom: "8px",
							}}
						/>
						<Bar
							dataKey="presentPercent"
							name="Present %"
							fill="#1e9df1"
							radius={[10, 10, 0, 0]}
							legendType="circle"
						/>
						<Bar
							dataKey="absentPercent"
							name="Absent %"
							fill="#788087"
							radius={[10, 10, 0, 0]}
							legendType="circle"
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default Attendance;
