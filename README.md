# cowork demo app

> **What this file is for:** explains what this small repo is and how to set it up on a teammate's laptop. This is repo 2: the app the agents edit during the Agent Cowork demo. The tool itself lives in repo 1 (the folder above this one, `Calhacks/`).

A tiny TypeScript app with four modules, one per teammate:

| Module | Folder | Teammate |
|---|---|---|
| Users and logins | `src/users/` | A |
| Session timeout | `src/sessions/` | B |
| Login statistics | `src/analytics/` | C |
| What the frontend reads | `src/api/` | D |

They all share the `User` type in `src/contracts/user.ts`. Its `lastLogin` field starts out in seconds. The scripted conflict in [SCENARIO.md](SCENARIO.md) changes that unit.

## Set up a laptop

1. Clone this repo (repo 2) somewhere outside repo 1, and run `npm install`.
2. `npm run typecheck` and `npm test` should both pass on `main`.
3. In repo 1: `npm run install-hooks -- --demo <path to this clone> --name <you>`.
4. Open Claude Code in this folder. `/hooks` should list the cowork hooks and `/mcp` should show `cowork`.

The orchestrator needs its own clone that nobody codes in. Point `DEMO_REPO_PATH` in repo 1's `.env` at it. `cowork.owners.json` says which agent owns which feature; the orchestrator reads it from `main`.

## Rules for the agents

[CLAUDE.md](CLAUDE.md) holds them. Claude Code loads it automatically in this folder.
