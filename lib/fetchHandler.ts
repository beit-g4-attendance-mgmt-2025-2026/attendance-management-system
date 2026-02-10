import { handleErrorResponse } from "./response";

interface FetchOptions extends RequestInit {
	timeout?: number;
}

export default async function fetchHandler(
	url: string,
	options: FetchOptions = {},
) {
	const { timeout = 5000, headers: customHeaders, ...restOptions } = options;
	const controller = new AbortController(); // Create an AbortController to handle timeout
	const id = setTimeout(() => {
		controller.abort(); // Abort the request after the timeout
	}, timeout);

	const defaultHeaders = {
		"Content-Type": "application/json",
		Accept: "application/json",
	};

	const config = {
		...restOptions,
		headers: {
			...defaultHeaders, // Default headers
			...customHeaders, // Merge custom headers with default headers
		},
		signal: controller.signal, //** Attach the signal to the request
	};
	try {
		const response = await fetch(url, config);
		clearTimeout(id); // Clear the timeout if the request completes in time
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			throw new Error("Request Timeout");
		} else {
			return handleErrorResponse(error);
		}
	}
}
