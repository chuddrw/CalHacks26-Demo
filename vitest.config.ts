/**
 * demo-app/vitest.config.ts
 *
 * WHAT IT'S FOR
 *   Test settings the watcher relies on: which files are tests (src/**\/*.test.ts) and that they run
 *   in plain Node. The watcher runs `vitest run --reporter=json` with this config in every merged
 *   worktree and parses the JSON it prints.
 *
 * OWNER: C.
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
