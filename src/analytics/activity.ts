/**
 * src/analytics/activity.ts
 *
 * WHAT IT'S FOR
 *   C's module in the demo: login statistics. The baseline doesn't read lastLogin. In demo beat 4,
 *   C's agent adds a function that does (for example activeInLast24h), right after the conflict is
 *   resolved. The verified fact "User.lastLogin is milliseconds" reaches it first, so it writes the
 *   right math on the first try.
 *
 * OWNER: C writes the baseline. In the demo, C's agent edits it.
 */

export interface LoginEvent {
  userId: string;
  at: Date;
}

/** How many different users logged in on the given UTC day. */
export function distinctUsersOnDay(events: LoginEvent[], day: Date): number {
  const dayKey = day.toISOString().slice(0, 10);
  const users = events.filter((event) => event.at.toISOString().slice(0, 10) === dayKey).map((event) => event.userId);
  return new Set(users).size;
}
