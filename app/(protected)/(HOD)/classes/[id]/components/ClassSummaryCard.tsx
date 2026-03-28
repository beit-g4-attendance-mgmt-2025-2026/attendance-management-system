import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MyClassItem } from "@/lib/actions/GetMyClass.actions";

type Props = {
	classInfo: MyClassItem;
	year?: string;
	semester?: string;
};

const ClassSummaryCard = ({ classInfo, year, semester }: Props) => {
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-xl">{classInfo.name}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{year && semester && (
					<div className="flex flex-wrap gap-2">
						<span className="rounded-md border px-2 py-1 text-xs">
							Year: {year}
						</span>
						<span className="rounded-md border px-2 py-1 text-xs">
							Semester: {semester}
						</span>
					</div>
				)}

				<div>
					<p className="text-sm text-muted-foreground">
						Family Teacher
					</p>
					<p className="font-medium">{classInfo.familyTeacher}</p>
				</div>

				<div className="grid grid-cols-3 gap-3">
					<div className="rounded-lg border p-3 text-center">
						<p className="text-xs text-muted-foreground">Male</p>
						<p className="text-lg font-semibold">
							{classInfo.male}
						</p>
					</div>
					<div className="rounded-lg border p-3 text-center">
						<p className="text-xs text-muted-foreground">Female</p>
						<p className="text-lg font-semibold">
							{classInfo.female}
						</p>
					</div>
					<div className="rounded-lg border p-3 text-center">
						<p className="text-xs text-muted-foreground">Total</p>
						<p className="text-lg font-semibold">
							{classInfo.total}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ClassSummaryCard;
