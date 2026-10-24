/**
 * src/sessions/session.ts
 *
 * WHAT IT'S FOR
 *   B's module in the demo: session timeout, which reads User.lastLogin. This file is on main, so
 *   when A's agent switches to milliseconds it can see this caller and update it. The break in the
 *   demo comes from B's NEW file, src/sessions/idle.ts, which exists only on B's laptop.
 *
 * OWNER: C writes the baseline. In the demo, A's agent edits it (B's agent works next to it).
 */
import type { User } from "../contracts/user";

export const SESSION_TIMEOUT_SECONDS = 30 * 60;

export function isSessionExpired(user: User, now: Date): boolean {
  const nowSeconds = now.getTime() / 1000;
  return nowSeconds - user.lastLogin > SESSION_TIMEOUT_SECONDS;
}
