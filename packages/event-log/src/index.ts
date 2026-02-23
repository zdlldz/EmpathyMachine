import { appendFile, mkdir, readFile } from "node:fs/promises";
import { dirname } from "node:path";

import type { AuditEvent } from "@empathy-machine/shared-types";

export async function writeAuditEvent(
  logPath: string,
  event: AuditEvent,
): Promise<void> {
  await mkdir(dirname(logPath), { recursive: true });
  await appendFile(logPath, `${JSON.stringify(event)}\n`, "utf8");
}

export async function readAuditEvents(logPath: string): Promise<AuditEvent[]> {
  try {
    const raw = await readFile(logPath, "utf8");
    const lines = raw.split("\n").filter(Boolean);
    const events: AuditEvent[] = [];
    for (const line of lines) {
      try {
        events.push(JSON.parse(line) as AuditEvent);
      } catch {
        // Keep processing even if one line is malformed.
      }
    }
    return events;
  } catch {
    return [];
  }
}
