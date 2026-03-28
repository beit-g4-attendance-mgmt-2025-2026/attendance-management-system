"use client";

import type { SessionPayload } from "@/lib/stores/auth-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useEffect } from "react";

export function AuthStoreSync() {
	useEffect(() => {
		let cancelled = false;
		const { setStatus, setFromMe, setFailed } = useAuthStore.getState();

		async function load() {
			setStatus("loading");
			try {
				const res = await fetch("/api/me", { credentials: "include" });
				const json: { success?: boolean; data?: SessionPayload } =
					await res.json().catch(() => ({}));

				if (cancelled) return;

				if (!res.ok || !json.success || !json.data) {
					setFailed();
					return;
				}

				setFromMe(json.data);
			} catch {
				if (!cancelled) setFailed();
			}
		}

		void load();
		return () => {
			cancelled = true;
		};
	}, []);

	return null;
}
