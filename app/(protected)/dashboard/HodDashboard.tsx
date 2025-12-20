import UserCard from "@/app/components/UserCard";
import React from "react";
import CountChart from "@/app/components/CountChart";
import Attendance from "@/app/components/Attendance";
import StarStudents from "@/app/components/StarStudents";

const HodDashboard = () => {
  return (
    <div className="w-full ">
      <div className="flex gap-4 w-full flex-wrap">
        <UserCard type="students" count="500" />
        <UserCard type="teachers" count="52" />
        <UserCard type="Critical Absentees" count="9" />
        <UserCard type="Pending Reports" count="3" />
      </div>
      {/* Middle Charts */}
      <div className="flex gap-4 flex-col lg:flex-row mt-5">
        <div className="w-full lg:w-1/3 h-[450px]">
          <CountChart />
        </div>
        <div className="w-full lg:w-2/3 h-[450px]">
          <Attendance />
        </div>
      </div>
      <div className="mt-4">
        <StarStudents />
      </div>
    </div>
  );
};

export default HodDashboard;
