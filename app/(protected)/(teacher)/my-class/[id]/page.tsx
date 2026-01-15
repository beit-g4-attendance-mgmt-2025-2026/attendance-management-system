const page = async ({
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;
	return <div>{id}</div>;
};

export default page;
