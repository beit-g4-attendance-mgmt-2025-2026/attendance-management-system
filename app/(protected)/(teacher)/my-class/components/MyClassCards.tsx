import ClassCard from "@/components/ClassCard";
import type { MyClassItem } from "@/lib/actions/GetMyClass.actions";

type Props = {
	classes: MyClassItem[];
};

const MyClassCards = ({ classes }: Props) => {
	if (classes.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-[20vh]">
				<p className="text-gray-500">You have no class!</p>
			</div>
		);
	}

	return (
		<div className="grid md:grid-cols-3 gap-10">
			{classes.map((classItem) => (
				<ClassCard
					key={classItem.id}
					classItem={classItem}
					variant="my-class"
				/>
			))}
		</div>
	);
};

export default MyClassCards;
