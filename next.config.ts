import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{
				source: "/",
				destination: "/dashboard",
				permanent: false,
			},
		];
	},
	// images: {
	// 	remotePatterns: [{ hostname: "img.clerk.com" }],
	// },
};

export default nextConfig;
