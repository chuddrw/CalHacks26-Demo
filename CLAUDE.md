# Team rules for agents in this repo

> What this file is for: the rules every Claude Code agent follows in demo-app. Four teammates each run an agent here on their own laptop, and a tool called cowork connects them. (Humans: the scripted demo is in SCENARIO.md.)

## How the team works

Four agents edit this repo at the same time, each on its own laptop. cowork sees everyone's uncommitted work, merges it onto main, and runs the type check and the tests. Messages that start with `[cowork]` come from that checker and describe real results for the team's combined code.

## Before you change shared code

Call the `post_intent` tool before you change anything other files import: an exported function, a type, or the meaning or unit of a field. One sentence on what you're changing and why, then make the change.

## When a [cowork] conflict names you as the fixer

Fixing it is your first job:

1. Call the `pull_teammate` tool with the teammate named in the message. It brings their in-progress change into your working tree, so you can run the tests on both changes together.
2. Keep their changes exactly as pulled, and adapt your own files until `npm test` passes.
3. The check re-runs after your next edit. You're done when cowork stops reporting the conflict; then continue with your task.

Tests are the team's shared contract, so keep every existing test as it is. If you believe a test itself is wrong, say so in one line and stop, so a person can decide.

## Verified facts

Facts marked "verified" in `[cowork]` notes were proven by a passing check. Treat them as true and build on them.

## Code and tests

- Tests call the real module functions (`createUser`, `recordLogin`, `getUser`), so they notice when another module changes.
- `npm run typecheck` and `npm test` pass on your laptop before you finish a task.
