import React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import Image from "next/image";
const data = [
  {
    name: "Total",
    count: 100,
    fill: "#fff",
  },
  {
    name: "Girls",
    count: 45,
    fill: "#4eb1f4",
  },
  {
    name: "Boys",
    count: 55,
    fill: "#788087",
  },
];

const CountChart = () => {
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
              label={{ position: "insideStart", fill: "#fff" }}
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
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-secondary rounded-full" />
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-xs text-gray-800">Boys (55%)</h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-primary rounded-full" />
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-xs text-gray-800">Girls (45%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
