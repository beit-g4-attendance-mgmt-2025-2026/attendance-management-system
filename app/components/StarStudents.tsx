import React from "react";
import { Star, Trophy, Award } from "lucide-react";

const STAR_STUDENTS = [
  {
    id: 1,
    name: "Alice Johnson",
    class: "Year 3-A",
    attendance: 99,
    avatar: "AJ",
  },
  {
    id: 2,
    name: "Michael Chen",
    class: "Year 1-B",
    attendance: 98,
    avatar: "MC",
  },
  {
    id: 3,
    name: "Sarah Williams",
    class: "Year 4-C",
    attendance: 98,
    avatar: "SW",
  },
];

const StarStudents = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm   h-full dark:bg-[#1E293B]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Star className="text-yellow-500 fill-yellow-500" size={20} />
          Star Students
        </h2>
        <span className="text-xs text-white font-medium px-2 py-1 bg-secondary rounded-full">
          This Month
        </span>
      </div>

      <div className="space-y-4">
        {STAR_STUDENTS.map((student, index) => (
          <div
            key={student.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                  {student.avatar}
                </div>
                {index === 0 && (
                  <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 border-2 border-white">
                    <Trophy size={10} className="text-white" />
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-white">
                  {student.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-white">
                  {student.class}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-blue-600">
                {student.attendance}%
              </p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                Attendance
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors border-t border-gray-50">
        View All Rankings
      </button>
    </div>
  );
};

export default StarStudents;
