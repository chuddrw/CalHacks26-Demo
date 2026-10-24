/**
 * src/analytics/activity.test.ts
 *
 * WHAT IT'S FOR
 *   Tests for C's login statistics. In demo beat 4, C's agent adds tests here for its new function.
 *
 * OWNER: C writes the baseline.
 */
import { describe, expect, it } from "vitest";
import { distinctUsersOnDay } from "./activity";

describe("analytics", () => {
  it("counts each user once per day", () => {
    const events = [
      { userId: "u1", at: new Date("2026-10-24T09:00:00Z") },
      { userId: "u1", at: new Date("2026-10-24T18:00:00Z") },
      { userId: "u2", at: new Date("2026-10-24T20:00:00Z") },
      { userId: "u3", at: new Date("2026-10-25T01:00:00Z") },
    ];
    expect(distinctUsersOnDay(events, new Date("2026-10-24T00:00:00Z"))).toBe(2);
  });
});
