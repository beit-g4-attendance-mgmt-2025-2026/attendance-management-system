// import { MailtrapClient } from "mailtrap";

// // token = 7a67f4a7b1c1415ccc3b867962cb07a2

// const mailtrapToken = process.env.MAILTRAP_TOKEN;

// const testInboxId = Number.parseInt(
// 	process.env.MAILTRAP_TEST_INBOX_ID ?? "",
// 	10,
// );
// const accountId = Number.parseInt(process.env.MAILTRAP_ACCOUNT_ID ?? "", 10);

// export const mailtrapClient = mailtrapToken
// 	? new MailtrapClient({
// 			token: mailtrapToken,
// 			testInboxId: Number.isFinite(testInboxId) ? testInboxId : undefined,
// 			accountId: Number.isFinite(accountId) ? accountId : undefined,
// 		})
// 	: undefined;

// export const mailtrapConfig = {
// 	useTestingApi: Number.isFinite(testInboxId) && Number.isFinite(accountId),
// };

// export const sender = {
// 	email: process.env.MAILTRAP_SENDER_EMAIL ?? "mailtrap@demomailtrap.com",
// 	name: process.env.MAILTRAP_SENDER_NAME ?? "Thurein Naing",
// };
import { MailtrapClient } from "mailtrap";

const TOKEN = process.env.MAILTRAP_TOKEN!;

export const mailtrapClient = new MailtrapClient({
	token: TOKEN,
});

export const sender = {
	email: "hello@demomailtrap.com",
	name: "Technological University (MTLA)",
};
