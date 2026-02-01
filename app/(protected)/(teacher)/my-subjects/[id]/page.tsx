const page = async ({ params }: { params: Promise<{ code: string }> }) => {
	const { code } = await params;
	return <div>subject-{code}</div>;
};

export default page;
