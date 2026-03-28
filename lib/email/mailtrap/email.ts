import { mailtrapTransporter, sender } from "./mailtrap";
import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	WELCOME_TEMPLATE,
	renderEmailTemplate,
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
			html: renderEmailTemplate(
				PASSWORD_RESET_REQUEST_TEMPLATE,
				{
					resetURL,
				},
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
			html: renderEmailTemplate(PASSWORD_RESET_SUCCESS_TEMPLATE, {
				changedAt: new Date().toLocaleString("en-US", {
					dateStyle: "medium",
					timeStyle: "short",
				}),
			}),
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

	const html = renderEmailTemplate(WELCOME_TEMPLATE, { name });

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
