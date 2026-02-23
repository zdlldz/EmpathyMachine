import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { readAuditEvents } from "@empathy-machine/event-log";
import { runTick } from "@empathy-machine/worker";

test("worker runTick completes in no-credentials no-op mode", async () => {
  const tempDir = await mkdtemp(join(tmpdir(), "empathy-machine-worker-"));
  const logPath = join(tempDir, "events.jsonl");

  const previous = {
    EVENT_LOG_PATH: process.env.EVENT_LOG_PATH,
    BLUESKY_IDENTIFIER: process.env.BLUESKY_IDENTIFIER,
    BLUESKY_PASSWORD: process.env.BLUESKY_PASSWORD,
    PROACTIVE_MODE: process.env.PROACTIVE_MODE,
  };

  process.env.EVENT_LOG_PATH = logPath;
  delete process.env.BLUESKY_IDENTIFIER;
  delete process.env.BLUESKY_PASSWORD;
  process.env.PROACTIVE_MODE = "true";

  try {
    await runTick();
    const events = await readAuditEvents(logPath);
    assert.ok(Array.isArray(events));
  } finally {
    if (previous.EVENT_LOG_PATH === undefined) delete process.env.EVENT_LOG_PATH;
    else process.env.EVENT_LOG_PATH = previous.EVENT_LOG_PATH;
    if (previous.BLUESKY_IDENTIFIER === undefined) delete process.env.BLUESKY_IDENTIFIER;
    else process.env.BLUESKY_IDENTIFIER = previous.BLUESKY_IDENTIFIER;
    if (previous.BLUESKY_PASSWORD === undefined) delete process.env.BLUESKY_PASSWORD;
    else process.env.BLUESKY_PASSWORD = previous.BLUESKY_PASSWORD;
    if (previous.PROACTIVE_MODE === undefined) delete process.env.PROACTIVE_MODE;
    else process.env.PROACTIVE_MODE = previous.PROACTIVE_MODE;

    await rm(tempDir, { recursive: true, force: true });
  }
});
