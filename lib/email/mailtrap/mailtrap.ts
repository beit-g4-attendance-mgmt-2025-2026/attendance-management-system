import nodemailer from "nodemailer";

export const mailtrapTransporter = nodemailer.createTransport({
	host: "sandbox.smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: process.env.MAILTRAP_USERNAME!,
		pass: process.env.MAILTRAP_PASSWORD!,
	},
});

export const sender = {
	name: process.env.MAILTRAP_SENDER_NAME ?? "Technological University (MTLA)",
	email: process.env.MAILTRAP_SENDER_EMAIL ?? "tumeiktila.edu.mm",
};
