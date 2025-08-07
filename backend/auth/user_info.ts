import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "./auth";

// Returns the current user's information.
export const getUserInfo = api<void, AuthData>(
  { expose: true, method: "GET", path: "/auth/me", auth: true },
  async () => {
    const auth = getAuthData()!;
    return auth;
  }
);
