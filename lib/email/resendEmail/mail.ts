import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	WELCOME_TEMPLATE,
	renderEmailTemplate,
} from "../emailTemplates";
import { Resend } from "resend";

const resendClient = new Resend(process.env.RESEND_API_KEY!);

export async function sendPasswordResetEmail(email: string, resetURL: string) {
	if (!resendClient) {
		console.warn(
			"Resend is not configured. Skipping password reset email.",
		);
		return;
	}

	try {
		const from = process.env.RESEND_SENDER_EMAIL!;
		await resendClient.emails.send({
			from,
			to: email,
			subject: "Reset Your Password",
			html: renderEmailTemplate(
				PASSWORD_RESET_REQUEST_TEMPLATE,
				{
					resetURL,
				},
			),
		});
		console.log("Password reset email sent via Resend");
	} catch (error) {
		console.error("Error sending password reset email via Resend", error);
		if (process.env.NODE_ENV === "production") {
			throw new Error(`Error sending password reset email: ${error}`);
		}
	}
}

export async function sendResetSuccessEmail(email: string) {
	if (!resendClient) {
		console.warn("Resend is not configured. Skipping reset-success email.");
		return;
	}

	try {
		const from = process.env.RESEND_SENDER_EMAIL!;
		await resendClient.emails.send({
			from,
			to: email,
			subject: "Password Reset Successful",
			html: renderEmailTemplate(PASSWORD_RESET_SUCCESS_TEMPLATE, {
				changedAt: new Date().toLocaleString("en-US", {
					dateStyle: "medium",
					timeStyle: "short",
				}),
			}),
		});
		console.log("Reset success email sent via Resend");
	} catch (error) {
		console.error("Error sending reset-success email via Resend", error);
		if (process.env.NODE_ENV === "production") {
			throw new Error(
				`Error sending password reset success email: ${error}`,
			);
		}
	}
}

export async function sendWelcomeEmail(email: string, name: string) {
	if (!resendClient) {
		console.warn("Resend is not configured. Skipping welcome email.");
		return;
	}

	const html = renderEmailTemplate(WELCOME_TEMPLATE, { name });

	try {
		const from = process.env.RESEND_SENDER_EMAIL!;
		await resendClient.emails.send({
			from,
			to: email,
			subject: "Welcome",
			html,
		});
		console.log("Welcome email sent via Resend");
	} catch (error) {
		console.error("Error sending welcome email via Resend", error);
		if (process.env.NODE_ENV === "production") {
			throw new Error(`Error sending welcome email: ${error}`);
		}
	}
}
