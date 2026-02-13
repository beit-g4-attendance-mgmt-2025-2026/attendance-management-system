// "use server";

// import { setAuthCookie, signAuthToken } from "../jwt";
// import { verifyPassword } from "../password";
// import { prisma } from "../prisma";
// import {
// 	handleActionErrorResponse,
// 	handleErrorResponse,
// 	handleSuccessResponse,
// } from "../response";
// import LoginSchema from "../schema/LoginSchema";
// import { toPublicUser } from "../user";
// import validateBody from "../validateBody";

// export async function SignInWithCredentials(params: {
// 	username: string;
// 	password: string;
// }) {
// 	try {
// 		const validatedData = validateBody(params, LoginSchema);

// 		const { username, password } = validatedData.data;

// 		const user = await prisma.user.findFirst({ where: { username } });

// 		if (!user) {
// 			throw new Error("User not found");
// 		}

// 		const passwordMatch = await verifyPassword(password, user.password);

// 		if (!passwordMatch) {
// 			throw new Error("Invalid credentials");
// 		}

// 		const token = signAuthToken(user.id);
// 		const response = handleSuccessResponse(toPublicUser(user), 200);
// 		setAuthCookie(response, token);

// 		return response;
// 	} catch (error: unknown) {
// 		return handleErrorResponse(error);
// 	}
// }
