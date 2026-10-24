/**
 * src/api/routes.ts
 *
 * WHAT IT'S FOR
 *   D's module in the demo: the user JSON the frontend reads. The frontend's date code wants
 *   milliseconds, which is the reason A's agent is asked to switch lastLogin to milliseconds.
 *   D's agent isn't part of the scripted demo; this file gives the story its "why".
 *
 * OWNER: C writes the baseline.
 */
import { getUser } from "../users/user";

export interface UserJson {
  id: string;
  name: string;
  lastLogin: number;
}

export function getUserRoute(id: string): UserJson {
  const user = getUser(id);
  return { id: user.id, name: user.name, lastLogin: user.lastLogin };
}
