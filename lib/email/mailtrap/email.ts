import { mailtrapTransporter, sender } from "./mailtrap";
import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	WELCOME_TEMPLATE,
} from "../emailTemplates";

export async function sendPasswordResetEmailMailtrap(
	email: string,
	resetURL: string,
) {
	if (!mailtrapTransporter) {
		console.warn(
			"Mailtrap is not configured. Skipping password reset email.",
		);
		return;
	}

	try {
		const response = await mailtrapTransporter.sendMail({
			from: `${sender.name} <${sender.email}>`,
			to: email,
			subject: "Reset Your Password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
				"{resetURL}",
				resetURL,
			),
		});

		console.log("Password reset email sent via Mailtrap", response);
	} catch (error) {
		console.error("Error sending password reset email via Mailtrap", error);
		if (process.env.NODE_ENV === "production") {
			throw new Error(`Error sending password reset email: ${error}`);
		}
	}
}

export async function sendResetSuccessEmailMailtrap(email: string) {
	if (!mailtrapTransporter) {
		console.warn(
			"Mailtrap is not configured. Skipping reset-success email.",
		);
		return;
	}

	try {
		const response = await mailtrapTransporter.sendMail({
			from: `${sender.name} <${sender.email}>`,
			to: email,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
		});

		console.log("Reset success email sent via Mailtrap", response);
	} catch (error) {
		console.error("Error sending reset-success email via Mailtrap", error);
		if (process.env.NODE_ENV === "production") {
			throw new Error(
				`Error sending password reset success email: ${error}`,
			);
		}
	}
}

export async function sendWelcomeEmailMailtrap(email: string, name: string) {
	if (!mailtrapTransporter) {
		console.warn("Mailtrap is not configured. Skipping welcome email.");
		return;
	}

	const html = WELCOME_TEMPLATE.replace("{name}", name);

	try {
		const response = await mailtrapTransporter.sendMail({
			from: `${sender.name} <${sender.email}>`,
			to: email,
			subject: "Welcome",
			html,
		});

		console.log("Welcome email sent via Mailtrap", response);
	} catch (error) {
		console.error("Error sending welcome email via Mailtrap", error);
		if (process.env.NODE_ENV === "production") {
			throw new Error(`Error sending welcome email: ${error}`);
		}
	}
}
