# Demo scenario

> **What this file is for:** the exact, repeatable conflict we show judges. It lists the prompts to paste into each agent, the order, what should happen at each step, how to reset, and what to do when something goes wrong live. Rehearse it until it works 5 times out of 5. The spoken lines are in [../pitch/demo-script.md](../pitch/demo-script.md).

**Tested on Oct 24 with real git and the real tests (no hooks yet):** each change alone passes, the two together fail with `expected -29850839249 to be 31`, `pull_teammate` plus B's one-line fix turns everything green, and git merges both snapshots with no conflict.

## Cast

| Who | Machine | Role in the demo |
|---|---|---|
| B | Laptop B | Writes the new idle-time feature, then gets woken to fix it |
| A | Laptop A | Switches `lastLogin` to milliseconds |
| C | Laptop C | Beat 4 only: gets the verified fact and writes it right the first time |
| D | Watcher machine + big screen | Runs the watcher and the UI (`?big`), narrates |

## Reset (before every run)

Beat 4 needs A to commit to `main`, so every run moves `main` forward. The baseline commit carries the tag `demo-base` (see ../external/github.txt), and resetting goes back to it. These steps throw away work in the **demo clones only**, so never run them in repo 1.

1. On the watcher machine (repo 1): `npm run reset -- --agents a,b,c,d --clones <watcher clone> --reset-main --yes`. This empties the database, deletes every `wip/*` branch and moves repo 2's `main` back to `demo-base`.
2. On each laptop, in your demo clone: `git fetch origin`, `git checkout main`, `git reset --hard origin/main`, `git clean -fd`. Then `npm run reset -- --agents <you> --clones <your clone> --yes` from repo 1 to clear the hook state files. `git status` must be clean.
3. Watcher running (`npm run watcher`). UI open full screen at `http://localhost:5173/?big`. All cards online, none red.
4. On laptops A, B and C: a fresh Claude Code session in the demo clone (`/clear`).

## Beat 2: B builds a feature (seconds, correct for now)

Paste into B:

> Add a function `minutesSinceLastLogin(user: User, now: Date): number` in a new file `src/sessions/idle.ts`. It returns how many whole minutes have passed since the user's last login. Add tests in `src/sessions/idle.test.ts` that use `createUser`, `recordLogin` and `getUser` from `src/users/user.ts`. Run `npm test`.

What should happen:
- B writes something like `Math.floor((now.getTime() / 1000 - user.lastLogin) / 60)`, because the contract says seconds.
- B's tests pass, B's card shows green, and B's agent finishes its turn and goes **idle**.

Start this before the judges arrive, or during the opening line. It takes about a minute.

## Beat 3: A changes the unit (the conflict)

Paste into A:

> The frontend needs `User.lastLogin` in milliseconds since the Unix epoch. Change it to milliseconds and keep the field name `lastLogin`. Update every caller and test in this repo, and run `npm test`.

What should happen, in order:
1. A's agent calls `post_intent` ("Changing User.lastLogin from seconds to milliseconds..."). The intent shows up on A's card.
2. A edits `src/contracts/user.ts`, `src/users/user.ts`, `src/sessions/session.ts` and `src/users/user.test.ts`. A's tests pass on laptop A.
3. Within about 10 seconds of A's last edit: the screen turns red, showing conflict `a × b`, fixer **b**, first error `expected -29850839249 to be 31` in `src/sessions/idle.test.ts`. The Droid panel starts moving.
4. **B wakes up by itself** with the `[cowork] CONFLICT` message. It calls `pull_teammate("a")`, sees the failing test locally, and changes one line in its own file, to something like `Math.floor((now.getTime() - user.lastLogin) / 60_000)`.
5. The screen turns green. Memory shows **verified: User.lastLogin is milliseconds since the Unix epoch.**

Say out loud: git merged these cleanly and the type checker passed. Only running the code together caught it, and nobody had committed anything yet.

## Beat 4: memory prevents the next bug (C)

In a **new** session on laptop C (so SessionStart injects the facts), paste:

> Add `activeInLast24h(user: User, now: Date): boolean` to `src/analytics/activity.ts`: true if the user's last login was within the past 24 hours. Add a test that uses `createUser`, `recordLogin` and `getUser`.

What should happen: C's session opens with the verified fact, and C writes millisecond math (`now.getTime() - user.lastLogin < 24 * 60 * 60 * 1000`) on the first try. No conflict appears.

Before this beat, A commits and pushes its change to `main` (say it: "A's change is verified, so A merges it"), and C runs `git pull`. C's laptop otherwise still has the seconds code, and C's own test would fail for the wrong reason.

## When something goes wrong live

| What you see | What to do |
|---|---|
| B doesn't wake within 20 s | Say "B picks it up on its next step" and type `continue` in B's terminal. The inject-context hook delivers the conflict. |
| The screen doesn't turn red | Look at the watcher terminal. If it's stuck, switch to the backup video (pitch/demo-script.md, "Fallback"). |
| B wrote milliseconds from the start | B got A's intent early. That's the prevention story: say so and go straight to beat 4. |
| An agent edits a test to get green | That's the guard: the conflict goes to "needs a person". Point at it, it's a feature. |
| Wi-Fi is down | Backup video. Personal hotspots aren't allowed at Cal Hacks. |

## After the demo

When A commits its change to `main`, B runs `git stash -u && git pull && git stash pop`. The pulled lines are identical to `main`, so only B's own new files stay as changes. (Tested.)

## Rehearsal log

| # | Time | Red after (s) | B woke after (s) | Green after (s) | Notes |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |
