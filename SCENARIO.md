# Demo scenario

> This file is the exact, repeatable story we show judges, for the orchestrator version of Agent Cowork (repo 1, branch `feat/orchestrator`). It lists the prompts to paste into each agent, the order, what should happen at each step, how to reset, and what to do when something goes wrong live. Rehearse it until it works 5 times out of 5. The spoken lines are in [../pitch/demo-script.md](../pitch/demo-script.md).

**Tested on Oct 24 on a real local SpacetimeDB with real git, tsc and vitest** (`npm run test:live` in repo 1, 29/29): the orchestrator's plan, the review, both agents woken with their tasks, a's message waking b, b pulling a's change and agreeing on a green check, a agreeing, the fact in memory. A real Droid run on the beat-2 request took 52 s and planned exactly beats 2 and 3 (tasks for a and b, reviews by B and D, conflict a x b on the lastLogin unit).

## Cast

| Who | Machine | Role in the demo |
|---|---|---|
| B | Laptop B | Builds the idle-time feature; later reviews A's change and adapts sessions |
| A | Laptop A | Asks for milliseconds; A's agent changes the unit |
| C | Laptop C | Memory beat: gets the verified fact and writes it right the first time |
| D | Orchestrator laptop + big screen | Runs the orchestrator and the dashboard (`?big`), narrates |

## Reset (before every run)

The memory beat needs A to commit to `main`, so every run moves `main` forward. The baseline commit carries the tag `demo-base` (see ../external/github.txt), and resetting goes back to it. These steps throw away work in the **demo clones only**, so never run them in repo 1.

1. On the orchestrator laptop (repo 1): `npm run reset -- --agents a,b,c,d --clones <orchestrator clone> --reset-main --yes`. This empties the database, deletes every `wip/*` branch and moves repo 2's `main` back to `demo-base`.
2. On each laptop, in your demo clone: `git fetch origin`, `git checkout main`, `git reset --hard origin/main`, `git clean -fd`. Then `npm run reset -- --agents <you> --clones <your clone> --yes` from repo 1 to clear the hook state files. `git status` must be clean.
3. Orchestrator running (`npm run orchestrator`). Dashboard open full screen at `http://localhost:5173/?big`. All cards online, none red.
4. On laptops A, B and C: a fresh Claude Code session in the demo clone (`/clear`). The session-start hook starts each agent's listener, so an agent can be woken before it has edited anything.

## Beat 1: B builds a feature (seconds, correct for now)

Paste into B:

> Add a function `minutesSinceLastLogin(user: User, now: Date): number` in a new file `src/sessions/idle.ts`. It returns how many whole minutes have passed since the user's last login. Add tests in `src/sessions/idle.test.ts` that use `createUser`, `recordLogin` and `getUser` from `src/users/user.ts`. Then run check_with_team.

What should happen:
- It's B's own feature, so B's agent just builds it, assuming seconds (the contract says seconds).
- `check_with_team` is green; B's agent finishes and goes **idle**.

Start this before the judges arrive, or during the opening line. It takes about a minute.

## Beat 2: A asks the orchestrator for milliseconds

Paste into A:

> The frontend needs `User.lastLogin` in milliseconds since the Unix epoch. Keep the field name. That changes a shared contract, so ask the orchestrator.

What should happen, in order:
1. A's agent calls `ask_orchestrator`. The request shows up on the dashboard (Orchestrator) and Droid's steps stream in live: it calls team_status, reads the code, sees B's uncommitted idle.ts in the team's state.
2. Within about a minute the plan lands, in one transaction: a task for **a** (contract + users), a task for **b** (session timeout + the in-progress idle feature), a review for **B's human** (sessions read lastLogin; D's too if Droid flags the API), and a flagged conflict **a × b: lastLogin unit**, b suggested to adapt.
3. Nothing starts yet: the hub shows "1 review waiting for B".

Say out loud: Droid planned it and found the clash with work that was never committed. Code still applies the contract rule: a shared contract change always waits for the humans whose features read it.

## Beat 3: B's human approves; the agents settle it between them

B (or D on the big screen) clicks **Approve as B** in the Orchestrator drawer (and approves D's review if there is one).

What should happen:
1. Both agents wake up by themselves: A's with its task, B's with its task and **CONFLICT with a**.
2. A's agent changes the unit in its own files (contract, users and their test), posts its intent, and tells B with `message_teammate`. Its `check_with_team` says it fails alone: B's sessions still read seconds.
3. B's agent wakes on A's message, calls `pull_teammate("a")`, switches `session.ts` and `idle.ts` to milliseconds, runs `check_with_team` (green with a), and calls `agree` with "User.lastLogin is milliseconds since the Unix epoch."
4. A's agent wakes on B's agreement, runs `check_with_team` ("fails alone but passes together with b"), and agrees too.
5. The conflict resolves. Memory shows **verified: User.lastLogin is milliseconds since the Unix epoch.** Both agents call `complete_task`; the request shows Done.
6. The orchestrator rebuilds the full stack (main plus A's and B's work, checked) on `cowork/full-stack` and tells every agent. On any laptop, ask the agent for `get_full_stack` (or run `npm run full-stack -- --demo <clone>` in repo 1) and run `npm test` in `<clone>-full-stack`: the whole project, everyone's work together.

Say out loud: nobody assigned a fixer. The two agents that own the code talked it out, and the tests decided when they were done.

## Beat 4: memory prevents the next bug (C)

Before this beat, A commits and pushes its change to `main` (say it: "A's change is verified, so A merges it"), and C runs `git pull`.

In a **new** session on laptop C (so SessionStart injects the facts), paste:

> Add `activeInLast24h(user: User, now: Date): boolean` to `src/analytics/activity.ts`: true if the user's last login was within the past 24 hours. Add a test that uses `createUser`, `recordLogin` and `getUser`.

What should happen: C's session opens with the verified fact, and C writes millisecond math (`now.getTime() - user.lastLogin < 24 * 60 * 60 * 1000`) on the first try. No conflict appears.

## Optional beat: when the agents can't agree

In beat 3, paste into B instead of letting it adapt:

> Our session store keeps seconds. Don't switch sessions to milliseconds; escalate to the humans.

B's agent calls `escalate`. The dashboard shows "A's and B's humans decide" with both positions in the thread. Type a decision (for example "Use milliseconds; B converts at the session store") and press **Send decision to both agents**. Both agents wake with it and finish as in beat 3.

## When something goes wrong live

| What you see | What to do |
|---|---|
| Droid takes long | Keep narrating its steps; they are real. If it fails, the request shows "Planning failed" with the reason; ask again. |
| An agent doesn't wake within 20 s | Type `continue` in its terminal. The inject-context hook delivers the task or message on the next prompt. |
| The agents keep talking past 12 messages | The thread goes to both humans automatically. Decide on the dashboard. |
| B wrote milliseconds from the start | B saw A's request early. That's the prevention story: say so and go to beat 4. |
| An agent edits a test to get green | The guard sends the conflict to "needs a person". Point at it; it's a feature. |
| Wi-Fi is down | Backup video. Personal hotspots aren't allowed at Cal Hacks. |

## After the demo

When A commits its change to `main`, B runs `git stash -u && git pull && git stash pop`. The pulled lines are identical to `main`, so only B's own changes stay. (Tested.)

## Rehearsal log

| # | Time | Plan landed after (s) | B woke after approval (s) | Resolved after (s) | Notes |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |
