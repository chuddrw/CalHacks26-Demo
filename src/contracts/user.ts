/**
 * src/contracts/user.ts
 *
 * WHAT IT'S FOR
 *   The User type that every module imports: the contract between modules. When its meaning
 *   changes, every module that reads it is affected. In the demo, A's agent changes the UNIT of
 *   lastLogin (seconds to milliseconds) but not its type (number). That's why the type checker
 *   can't catch the break, and why the agents' combined checks (check_with_team) have to.
 *   Stretch item 1 locks this folder, so edits here would need a person's approval.
 *
 * OWNER: C writes the baseline. In the demo, A's agent edits the comment on lastLogin.
 */
export interface User {
  id: string;
  name: string;
  /** Time of the last login, in seconds since the Unix epoch. 0 means never logged in. */
  lastLogin: number;
}
