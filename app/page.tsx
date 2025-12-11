import prisma from "@/lib/prisma";

export default async function Home() {
	const users = await prisma.user.findMany();
	const posts = await prisma.post.findMany();
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
			<h1 className="text-4xl font-bold mb-8  text-[#333333]">
				Superblog
			</h1>
			<ol className="list-decimal list-inside ">
				{users.map((user) => (
					<li key={user.id} className="mb-2 text-black">
						{user.name}
					</li>
				))}
			</ol>
			<ol className="list-decimal list-inside ">
				{posts.map((post) => (
					<li key={post.id} className="mb-2 text-black">
						{post.title} by {post.authorId}
					</li>
				))}
			</ol>
		</div>
	);
}
