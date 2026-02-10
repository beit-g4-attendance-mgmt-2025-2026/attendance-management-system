import { mailtrapClient, sender } from "./mailtrap";
import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates";

function getMailtrapSender() {
	if (!mailtrapClient) {
		console.warn("Mailtrap is not configured. Skipping email send.");
		return null;
	}
	return mailtrapClient;
}

export async function sendPasswordResetEmail(email: string, resetURL: string) {
	const mailer = getMailtrapSender();
	if (!mailer) return;

	const recipient = [{ email }];

	try {
		const response = await mailer.send({
			from: sender,
			to: recipient,
			subject: "Reset Your Password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
				"{resetURL}",
				resetURL,
			),
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error("Error sending password reset email", error);
		if (process.env.NODE_ENV === "production") {
			throw new Error(`Error sending password reset email: ${error}`);
		}
	}
}

export async function sendResetSuccessEmail(email: string) {
	const mailer = getMailtrapSender();
	if (!mailer) return;

	const recipient = [{ email }];

	try {
		const response = await mailer.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});
		console.log("Password reset success email sent successfully", response);
	} catch (error) {
		console.error("Error sending password reset success email", error);
		if (process.env.NODE_ENV === "production") {
			throw new Error(
				`Error sending password reset success email: ${error}`,
			);
		}
	}
}

export async function sendWelcomeEmail(email: string, name: string) {
	const mailer = getMailtrapSender();
	if (!mailer) return;

	const recipient = [{ email }];

	try {
		const response = await mailer.send({
			from: sender,
			to: recipient,
			subject: "Welcome",
			html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1b1f24;">
        <h2>Welcome, ${name}!</h2>
        <p>Thanks for joining us.</p>
      </div>`,
			category: "Welcome",
		});
		console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error("Error sending welcome email", error);
		if (process.env.NODE_ENV === "production") {
			throw new Error(`Error sending welcome email: ${error}`);
		}
	}
}
