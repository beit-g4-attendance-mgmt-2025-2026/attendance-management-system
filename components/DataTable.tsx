// import React from "react";
// import {
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableHead,
// 	TableHeader,
// 	TableRow,
// } from "@/components/ui/table";

// type Column<T> = {
// 	header: React.ReactNode;
// 	accessor: keyof T | ((row: T) => React.ReactNode);
// 	width?: string;
// 	className?: string;
// };

// interface DataTableProps<T> {
// 	columns: Column<T>[];
// 	data: T[];
// 	rowKey?: keyof T;
// 	selected?: T | null;
// 	onSelect?: (row: T) => void;
// 	renderActions?: (row: T) => React.ReactNode;
// }

// export default function DataTable<T extends Record<string, any>>({
// 	columns,
// 	data,
// 	rowKey,
// 	selected,
// 	onSelect,
// 	renderActions,
// }: DataTableProps<T>) {
// 	return (
// 		<Table>
// 			<TableHeader>
// 				<TableRow>
// 					{columns.map((col, i) => (
// 						<TableHead
// 							key={i}
// 							className={col.width || col.className}
// 						>
// 							{col.header}
// 						</TableHead>
// 					))}
// 					{renderActions ? <TableHead>Action</TableHead> : null}
// 				</TableRow>
// 			</TableHeader>
// 			<TableBody>
// 				{data?.map((row, idx) => {
// 					const key = rowKey ? String(row[rowKey]) : String(idx);
// 					const isSelected =
// 						selected && rowKey
// 							? selected[rowKey] === row[rowKey]
// 							: false;
// 					return (
// 						<TableRow
// 							key={key}
// 							onClick={() => onSelect && onSelect(row)}
// 							className={`cursor-pointer transition-colors ${
// 								isSelected ? "bg-blue-300 dark:bg-blue-500" : ""
// 							}`}
// 						>
// 							{columns.map((col, i) => {
// 								const value =
// 									typeof col.accessor === "function"
// 										? col.accessor(row)
// 										: (row as any)[col.accessor];
// 								return <TableCell key={i}>{value}</TableCell>;
// 							})}
// 							{renderActions ? (
// 								<TableCell onClick={(e) => e.stopPropagation()}>
// 									{renderActions(row)}
// 								</TableCell>
// 							) : null}
// 						</TableRow>
// 					);
// 				})}
// 			</TableBody>
// 		</Table>
// 	);
// }
