/**
 * src/users/user.ts
 *
 * WHAT IT'S FOR
 *   A's module in the demo: creating users and recording logins. An in-memory Map stands in for a
 *   database, so the demo needs no setup. In the scripted conflict, A's agent changes recordLogin
 *   to store milliseconds and updates every caller it can see on main.
 *
 * OWNER: C writes the baseline. In the demo, A's agent edits it.
 */
import type { User } from "../contracts/user";

const users = new Map<string, User>();

export function createUser(id: string, name: string): User {
  const user: User = { id, name, lastLogin: 0 };
  users.set(id, user);
  return { ...user };
}

export function recordLogin(id: string, at: Date): void {
  const user = users.get(id);
  if (!user) throw new Error(`No user with id ${id}`);
  user.lastLogin = Math.floor(at.getTime() / 1000);
}

export function getUser(id: string): User {
  const user = users.get(id);
  if (!user) throw new Error(`No user with id ${id}`);
  return { ...user };
}

/** Test helper: forget every user. */
export function resetUsers(): void {
  users.clear();
}
