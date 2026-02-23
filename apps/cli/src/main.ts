import { readAuditEvents } from "@empathy-machine/event-log";
import { runTick } from "@empathy-machine/worker";

const EVENT_LOG_PATH = process.env.EVENT_LOG_PATH ?? ".runtime/events.jsonl";

async function run(): Promise<void> {
  const command = process.argv[2] ?? "help";

  switch (command) {
    case "run-once": {
      await runTick();
      console.info("[cli] run-once completed");
      return;
    }
    case "status": {
      const events = await readAuditEvents(EVENT_LOG_PATH);
      const last = events.at(-1);
      console.info("[cli] status", {
        eventCount: events.length,
        lastEventKind: last?.kind ?? null,
        lastEventTime: last?.timestamp ?? null,
      });
      return;
    }
    case "tail-events": {
      const limit = Number(process.argv[3] ?? "20");
      const events = await readAuditEvents(EVENT_LOG_PATH);
      for (const event of events.slice(-limit)) {
        console.log(JSON.stringify(event));
      }
      return;
    }
    default: {
      console.log("Usage:");
      console.log("  npm run dev:cli -- run-once");
      console.log("  npm run dev:cli -- status");
      console.log("  npm run dev:cli -- tail-events [limit]");
    }
  }
}

run().catch((error) => {
  console.error("[cli] fatal", error);
  process.exitCode = 1;
});
