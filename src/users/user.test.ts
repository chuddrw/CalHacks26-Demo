/**
 * src/users/user.test.ts
 *
 * WHAT IT'S FOR
 *   Tests for A's module. When A's agent switches lastLogin to milliseconds, it updates these
 *   expectations as part of its own change. That's a normal edit; the test guard only
 *   looks at edits made while fixing a conflict.
 *
 * OWNER: C writes the baseline.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { createUser, getUser, recordLogin, resetUsers } from "./user";

const T0 = new Date("2026-10-24T12:00:00Z");

describe("users", () => {
  beforeEach(() => resetUsers());

  it("starts with no login", () => {
    createUser("u1", "Ada");
    expect(getUser("u1").lastLogin).toBe(0);
  });

  it("records the login time in seconds", () => {
    createUser("u1", "Ada");
    recordLogin("u1", T0);
    expect(getUser("u1").lastLogin).toBe(T0.getTime() / 1000);
  });
});
