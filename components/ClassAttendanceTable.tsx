import { attendanceClassData, SUBJECTS } from "@/constants/index.constants";

const ClassAttendanceTable = () => {
	const renderPAHeaders = (prefix: string) =>
		["P", "A"].map((label) => (
			<th
				key={`${prefix}-${label}`}
				className="border border-black px-3 py-2 text-sm"
			>
				{label}
			</th>
		));

	return (
		<div className="overflow-x-auto">
			<table className="w-full border-collapse border border-black text-center">
				{/* HEADER */}
				<thead>
					<tr>
						<th
							rowSpan={2}
							className="border border-black px-3 py-2 "
						>
							No
						</th>
						<th
							rowSpan={2}
							className="border border-black px-3 py-2"
						>
							Name
						</th>
						<th
							rowSpan={2}
							className="border border-black px-3 py-2"
						>
							Roll No
						</th>

						{SUBJECTS.map((dept) => (
							<th
								key={dept.name}
								colSpan={2}
								className="border border-black px-3 py-2 [writing-mode:vertical-rl] rotate-180"
							>
								{dept.name}
							</th>
						))}
						<th
							colSpan={2}
							className="border border-black px-3 py-2 [writing-mode:vertical-rl] rotate-180"
						>
							Total
						</th>
						<th
							rowSpan={2}
							className="border border-black px-3 py-2 [writing-mode:vertical-rl] rotate-180"
						>
							Percentage
						</th>
					</tr>

					<tr>
						{SUBJECTS.flatMap((dept) =>
							renderPAHeaders(dept.name.toLocaleLowerCase()),
						)}
						{renderPAHeaders("total")}
					</tr>
				</thead>

				{/* BODY */}
				<tbody>
					{attendanceClassData.map((data, index) => (
						<tr key={index} className="">
							<td className="border border-black px-3 py-2">
								{index + 1}
							</td>
							<td className="border border-black px-3 py-2">
								{data.name}
							</td>
							<td className="border border-black px-3 py-2">
								{data.rollNo}
							</td>
							<td className="border border-black px-3 py-2">
								{data.english.present}
							</td>
							<td className="border border-black px-3 py-2">
								{data.english.absent}
							</td>
							<td className="border border-black px-3 py-2">
								{data.Mathematics.present}
							</td>
							<td className="border border-black px-3 py-2">
								{data.Mathematics.absent}
							</td>
							<td className="border border-black px-3 py-2">
								{" "}
								{data.Java.present}
							</td>
							<td className="border border-black px-3 py-2">
								{" "}
								{data.Java.absent}
							</td>
							<td className="border border-black px-3 py-2">
								{data.computer_network.present}
							</td>
							<td className="border border-black px-3 py-2">
								{data.computer_network.absent}
							</td>
							<td className="border border-black px-3 py-2">
								{data.dbms.present}
							</td>
							<td className="border border-black px-3 py-2">
								{data.dbms.absent}
							</td>
							<td className="border border-black px-3 py-2">
								{data.javascript.present}
							</td>
							<td className="border border-black px-3 py-2">
								{data.javascript.absent}
							</td>
							<td className="border border-black px-3 py-2">
								{data.javascript.present}
							</td>
							<td className="border border-black px-3 py-2">
								{data.javascript.absent}
							</td>
							<td className="border border-black px-3 py-2">
								84
							</td>
							<td className="border border-black px-3 py-2">0</td>
							<td className="border border-black px-3 py-2">
								100%
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ClassAttendanceTable;
