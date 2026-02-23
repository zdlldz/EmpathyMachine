import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { readAuditEvents, writeAuditEvent } from "@empathy-machine/event-log";
import type { AuditEvent } from "@empathy-machine/shared-types";

function makeAuditEvent(kind: AuditEvent["kind"]): AuditEvent {
  return {
    eventId: `${kind}-1`,
    kind,
    timestamp: new Date().toISOString(),
    conversationId: "conv-test",
    payload: { ok: true },
  };
}

test("event log writes and reads back JSONL events", async () => {
  const tempDir = await mkdtemp(join(tmpdir(), "empathy-machine-"));
  const logPath = join(tempDir, "events.jsonl");

  try {
    await writeAuditEvent(logPath, makeAuditEvent("inbound_seen"));
    await writeAuditEvent(logPath, makeAuditEvent("publish_result"));
    const events = await readAuditEvents(logPath);
    assert.equal(events.length, 2);
    assert.equal(events[0]?.kind, "inbound_seen");
    assert.equal(events[1]?.kind, "publish_result");
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});
