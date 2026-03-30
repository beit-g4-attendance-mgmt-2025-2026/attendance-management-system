import { create } from "zustand";
import type { Role } from "@/generated/prisma/enums";
import type { UiRole } from "@/lib/auth-ui";
import type { PublicUser } from "@/lib/user";

export type PublicAdminSession = {
	id: string;
	username: string;
	role: Role;
};

export type SessionPayload = {
	account: "admin" | "user";
	uiRole: UiRole;
	admin: PublicAdminSession | null;
	user: PublicUser | null;
};

type AuthStatus = "idle" | "loading" | "ready" | "error";

type AuthState = {
	status: AuthStatus;
	account: "admin" | "user" | null;
	uiRole: UiRole | null;
	admin: PublicAdminSession | null;
	user: PublicUser | null;
	setFromMe: (payload: SessionPayload) => void;
	setStatus: (status: AuthStatus) => void;
	setFailed: () => void;
	clear: () => void;
};

const initialState: Pick<
	AuthState,
	"status" | "account" | "uiRole" | "admin" | "user"
> = {
	status: "idle",
	account: null,
	uiRole: null,
	admin: null,
	user: null,
};

export const useAuthStore = create<AuthState>((set) => ({
	...initialState,
	setFromMe: (payload) =>
		set({
			status: "ready",
			account: payload.account,
			uiRole: payload.uiRole,
			admin: payload.admin,
			user: payload.user,
		}),
	setStatus: (status) => set({ status }),
	setFailed: () =>
		set({
			status: "error",
			account: null,
			uiRole: null,
			admin: null,
			user: null,
		}),
	clear: () => set({ ...initialState }),
}));

/** Use when `status === "ready"` so the session matches the server JWT. */
export function useHasUiRole(roles: UiRole[]) {
	const uiRole = useAuthStore((s) => s.uiRole);
	const ready = useAuthStore((s) => s.status === "ready");
	return ready && uiRole != null && roles.includes(uiRole);
}
