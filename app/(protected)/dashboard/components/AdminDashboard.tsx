import Link from "next/link";
import React from "react";
import { GoPersonFill } from "react-icons/go";
import { FaWarehouse } from "react-icons/fa";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { MdDateRange } from "react-icons/md";
const AdminDashboard = () => {
	return (
		<div className="md:ms-36 mx-auto">
			<h1 className="font-semibold text-2xl my-10">Welcome back!</h1>
			<div className="flex flex-col space-y-5">
				<div className="flex flex-col">
					<div className="flex items-center space-x-3">
						<div className="w-8 h-8 flex justify-center items-center rounded-md  bg-blue-50  cursor-pointer">
							<GoPersonFill className="size-5 text-sidebar" />
						</div>
						<Link
							href={"head-of-department/add"}
							className="font-medium text-lg cursor-pointer"
						>
							Add Head of Department
						</Link>
					</div>
					<div className="flex space-x-3">
						<span className="w-10"></span>
						<p className="text-xs max-w-xs">
							Create and manage Head of Department profiles and
							academic leadership.
						</p>
					</div>
				</div>

				<div className="flex flex-col">
					<div className="flex items-center space-x-3">
						<div className="w-8 h-8 flex justify-center items-center rounded-md  bg-blue-50  cursor-pointer">
							<FaWarehouse className="size-5 text-sidebar" />
						</div>
						<Link
							href={"departments/add"}
							className="font-medium text-lg cursor-pointer"
						>
							Add Departments
						</Link>
					</div>
					<div className="flex space-x-3">
						<span className="w-10"></span>
						<p className="text-xs max-w-xs">
							Organize and manage academic departments within the
							institution.
						</p>
					</div>
				</div>
				<div className="flex flex-col">
					<div className="flex items-center space-x-3">
						<div className="w-8 h-8 flex justify-center items-center rounded-md  bg-blue-50  cursor-pointer">
							<MdDateRange className="size-5 text-sidebar" />
						</div>
						<Link
							href={"academic-year"}
							className="font-medium text-lg cursor-pointer"
						>
							Add Academic Year
						</Link>
					</div>
					<div className="flex space-x-3">
						<span className="w-10"></span>
						<p className="text-xs max-w-xs">
							Add and manage academic year.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
