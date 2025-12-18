import Image from "next/image";
import { LoginForm } from "../components/LoginForm";

const page = () => {
	return (
		<div className="relative min-h-svh w-full flex items-center justify-center p-6 md:p-10">
			{/* Background Image Container */}
			<div className="absolute inset-0 -z-10">
				<Image
					src="/tu_meiktila.jpg"
					alt="Background"
					fill
					priority
					className="object-cover brightness-70"
				/>
			</div>

			{/* Login Form Container */}
			<div className="w-full max-w-sm">
				<LoginForm />
			</div>
		</div>
	);
};

export default page;
