"use client";

import React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import Image from "next/image";

type CountChartProps = {
	maleCount: number;
	femaleCount: number;
	otherCount?: number;
	totalCount?: number;
};

const CountChart = ({
	maleCount,
	femaleCount,
	otherCount = 0,
	totalCount,
}: CountChartProps) => {
	const total = totalCount ?? maleCount + femaleCount + otherCount;

	const data = [
		{
			name: "Total",
			count: total,
			fill: "#DBD5D5",
		},
		{
			name: "Female",
			count: femaleCount,
			fill: "#fff134",
		},
		{
			name: "Male",
			count: maleCount,
			fill: "#4eb1f4",
		},
		...(otherCount > 0
			? [
					{
						name: "Other",
						count: otherCount,
						fill: "#a855f7",
					},
				]
			: []),
	];

	const getPercent = (value: number) =>
		total > 0 ? Math.round((value / total) * 100) : 0;

	return (
		<div className="bg-white rounded-xl w-full h-full p-4 flex flex-col justify-between dark:bg-[#1E293B]">
			{/* TITLE */}
			<div className="flex justify-between items-center">
				<h1 className="text-lg font-semibold">Students</h1>
				<Image src="/more.png" alt="more" width={20} height={20} />
			</div>

			{/* CHART CONTAINER */}
			<div className="relative w-full h-[400px] ">
				<ResponsiveContainer>
					<RadialBarChart
						innerRadius="40%"
						outerRadius="100%"
						barSize={32}
						data={data}
						cx="50%"
						cy="50%"
					>
						<RadialBar
							background
							dataKey="count"
							label={{ position: "insideStart", fill: "#000000" }}
						/>
					</RadialBarChart>
				</ResponsiveContainer>
				<Image
					src="/malefemale.png"
					alt=""
					width={50}
					height={50}
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				/>
			</div>

			{/* BOTTOM */}
			<div className="flex justify-center gap-10 flex-wrap">
				<div className="flex flex-col gap-1 items-center">
					<div className="w-5 h-5 bg-[#4eb1f4] rounded-full" />
					<h1 className="font-bold">{maleCount}</h1>
					<h2 className="text-xs text-gray-800">
						Male ({getPercent(maleCount)}%)
					</h2>
				</div>
				<div className="flex flex-col gap-1 items-center">
					<div className="w-5 h-5 bg-[#fff134] rounded-full" />
					<h1 className="font-bold">{femaleCount}</h1>
					<h2 className="text-xs text-gray-800">
						Female ({getPercent(femaleCount)}%)
					</h2>
				</div>
				{otherCount > 0 && (
					<div className="flex flex-col gap-1 items-center">
						<div className="w-5 h-5 bg-purple-500 rounded-full" />
						<h1 className="font-bold">{otherCount}</h1>
						<h2 className="text-xs text-gray-800">
							Other ({getPercent(otherCount)}%)
						</h2>
					</div>
				)}
			</div>
		</div>
	);
};

export default CountChart;
