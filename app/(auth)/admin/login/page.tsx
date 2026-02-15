import Image from "next/image";
import { LoginForm } from "../../components/LoginForm";
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

			{/* Logo */}
			<div className="absolute top-6 left-6 z-10 flex items-center ">
				<Image
					src="/TU_logo.jpg"
					alt="Logo"
					width={40}
					height={40}
					priority
				/>
			</div>

			{/* Login Form Container */}
			<div className="w-full max-w-sm">
				<LoginForm url="http://localhost:3000/api/auth/admin/login" />
			</div>
		</div>
	);
};

export default page;
