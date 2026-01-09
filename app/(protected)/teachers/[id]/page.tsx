const page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	return <div>Teacher ID: {id}</div>;
};

export default page;
