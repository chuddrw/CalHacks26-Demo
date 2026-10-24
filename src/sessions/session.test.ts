/**
 * src/sessions/session.test.ts
 *
 * WHAT IT'S FOR
 *   Tests for the session timeout. They go through the real users module (createUser, recordLogin,
 *   getUser), so a change of unit in users/user.ts shows up here. That's how A's agent notices it
 *   has to update session.ts too.
 *
 * OWNER: C writes the baseline.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { createUser, getUser, recordLogin, resetUsers } from "../users/user";
import { isSessionExpired } from "./session";

const T0 = new Date("2026-10-24T12:00:00Z");
const minutesAfterLogin = (minutes: number) => new Date(T0.getTime() + minutes * 60_000);

describe("sessions", () => {
  beforeEach(() => {
    resetUsers();
    createUser("u1", "Ada");
    recordLogin("u1", T0);
  });

  it("is active 10 minutes after login", () => {
    expect(isSessionExpired(getUser("u1"), minutesAfterLogin(10))).toBe(false);
  });

  it("expires 31 minutes after login", () => {
    expect(isSessionExpired(getUser("u1"), minutesAfterLogin(31))).toBe(true);
  });
});
