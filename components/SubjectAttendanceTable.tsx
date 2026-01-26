export interface MonthlyAttendance {
	times: number;
	percentage: string;
}

export interface AttendanceRow {
	no: number;
	rollNo: string;
	name: string;
	december: MonthlyAttendance;
	january: MonthlyAttendance;
	february: MonthlyAttendance;
	march: MonthlyAttendance;
}

export interface AttendanceTableProps {
	data: AttendanceRow[];
}
export default function SubjectAttendanceTable({ data }: AttendanceTableProps) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full border-collapse border border-black text-center">
				{/* HEADER */}
				<thead>
					<tr>
						<th
							rowSpan={2}
							className="border border-black px-3 py-2"
						>
							No
						</th>
						<th
							rowSpan={2}
							className="border border-black px-3 py-2"
						>
							Roll No
						</th>
						<th
							rowSpan={2}
							className="border border-black px-3 py-2"
						>
							Name
						</th>

						<th
							colSpan={2}
							className="border border-black px-3 py-2"
						>
							December
						</th>
						<th
							colSpan={2}
							className="border border-black px-3 py-2"
						>
							January
						</th>
						<th
							colSpan={2}
							className="border border-black px-3 py-2"
						>
							February
						</th>
						<th
							colSpan={2}
							className="border border-black px-3 py-2"
						>
							March
						</th>
					</tr>

					<tr>
						{["Times", "Percentage"].map((label) => (
							<th
								key={`dec-${label}`}
								className="border border-black px-3 py-2 text-sm [writing-mode:vertical-rl] rotate-180"
							>
								{label}
							</th>
						))}
						{["Times", "Percentage"].map((label) => (
							<th
								key={`jan-${label}`}
								className="border border-black px-3 py-2 text-sm [writing-mode:vertical-rl] rotate-180"
							>
								{label}
							</th>
						))}
						{["Times", "Percentage"].map((label) => (
							<th
								key={`feb-${label}`}
								className="border border-black px-3 py-2 text-sm [writing-mode:vertical-rl] rotate-180"
							>
								{label}
							</th>
						))}
						{["Times", "Percentage"].map((label) => (
							<th
								key={`mar-${label}`}
								className="border border-black px-3 py-2 text-sm [writing-mode:vertical-rl] rotate-180"
							>
								{label}
							</th>
						))}
					</tr>
				</thead>

				{/* BODY */}
				<tbody>
					{data.map((row) => (
						<tr key={row.no}>
							<td className="border border-black px-3 py-2">
								{row.no}
							</td>
							<td className="border border-black px-3 py-2">
								{row.rollNo}
							</td>
							<td className="border border-black px-3 py-2">
								{row.name}
							</td>

							<td className="border border-black px-3 py-2">
								{row.december.times}
							</td>
							<td className="border border-black px-3 py-2">
								{row.december.percentage}
							</td>

							{/* January */}
							<td className="border border-black px-3 py-2">
								{row.january.times}
							</td>
							<td className="border border-black px-3 py-2">
								{row.january.percentage}
							</td>

							{/* February */}
							<td className="border border-black px-3 py-2">
								{row.february.times}
							</td>
							<td className="border border-black px-3 py-2">
								{row.february.percentage}
							</td>

							{/* March */}
							<td className="border border-black px-3 py-2">
								{row.march.times}
							</td>
							<td className="border border-black px-3 py-2">
								{row.march.percentage}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
