"use client";

import ClassForm from "@/components/ClassForm";
import { DialogCardBtn } from "@/components/DialogCardBtn";
import { ExportCsvBtn } from "@/components/ExportCsvBtn";
import SearchInput from "@/components/inputs/SearchInput";
import { useSelectedLayoutSegment } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
	const segment = useSelectedLayoutSegment();
	const isDetailPage = Boolean(segment);

	return (
		<>
			{!isDetailPage && (
				<header className="flex justify-between items-center mb-6">
					<SearchInput
						placeholder="Search class by name"
						className="bg-gray-200 rounded-2xl dark:bg-[#172139]"
					/>
					<div className="flex gap-3">
						<ExportCsvBtn
							endpoint="/api/classes/export"
							allowedParams={["search", "filter"]}
						/>
						<DialogCardBtn
							triggerName="Add Class"
							title="Add Class"
						>
							<ClassForm isEdit={false} />
						</DialogCardBtn>
					</div>
				</header>
			)}
			<main>{children}</main>
		</>
	);
};

export default Layout;
