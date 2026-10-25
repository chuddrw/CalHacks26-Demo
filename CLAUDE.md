# Team rules for agents in this repo

> What this file is for: the rules every Claude Code agent follows in demo-app. Four teammates each run an agent here on their own laptop, and a tool called cowork connects them.

## How the team works

Each agent works for one human and owns that human's features. `cowork.owners.json` says who owns which paths; `src/contracts/` is shared by everyone. A human asks for work through their own agent, and the orchestrator assigns each part to the agent that owns it. Messages that start with `[cowork]` come from cowork: tasks, conflict threads with a teammate's agent, their messages, and verified facts.

## When your human asks for something

If it only touches your own feature, do it. If it changes a shared contract or another owner's feature, call `ask_orchestrator` with your human's request, in their words. You'll get your part back as a task. Leave other owners' files to their agents.

## When a [cowork] TASK arrives

1. Work in your own files. Call `post_intent` before you change anything other files import: an exported function, a type, or the meaning or unit of a field.
2. When you're done, call `check_with_team`. It runs the type check and the tests on your work, alone and together with each teammate's work in progress.
3. When it's green, call `complete_task` with the task number and one line on what you did.

## When a [cowork] CONFLICT names you

A conflict is a thread between you and one teammate's agent. Settle it with them directly:

1. Tell them what you're changing and what you need from them with `message_teammate`. Each message wakes them.
2. Change only your own files. To test with their in-progress work, call `pull_teammate` with their name and keep their changes exactly as pulled.
3. When your side is done, call `check_with_team`, then `agree` with one sentence you both now treat as true. The conflict resolves when you both agree and the check is green, and that sentence becomes a verified fact.
4. If you can't agree, for example because the change would alter how your human's feature behaves, call `escalate` with both positions. Both humans then decide on the dashboard. Stop working on that conflict until their decision arrives as a `[cowork]` message.

Tests are the team's shared contract, so keep every existing test as it is. If you believe a test itself is wrong, say so in one line and stop, so a person can decide.

## The team's full stack

The orchestrator keeps the whole project, everyone's work merged and checked, on the branch `cowork/full-stack`. It only updates it when everything passes together, like a main branch that always runs. When your human wants to run the whole project, call `get_full_stack`: it puts that build in a folder next to your clone. Keep working in your own clone; the full-stack folder is for running and demoing.

## Verified facts

Facts marked "verified" in `[cowork]` notes were agreed by two agents and proven by a passing check. Treat them as true and build on them.

## Code and tests

- Tests call the real module functions (`createUser`, `recordLogin`, `getUser`), so they notice when another module changes.
- `npm run typecheck` and `npm test` pass on your laptop before you finish a task.
