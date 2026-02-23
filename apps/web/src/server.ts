import { createServer } from "node:http";

import { readAuditEvents } from "@empathy-machine/event-log";

const EVENT_LOG_PATH = process.env.EVENT_LOG_PATH ?? ".runtime/events.jsonl";
const PORT = Number(process.env.WEB_PORT ?? "4173");

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderHtml(totalEvents: number, recentEvents: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>EmpathyMachine Runtime</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 2rem auto; max-width: 1000px; line-height: 1.5; color: #111; }
      .card { border: 1px solid #d1d5db; border-radius: 10px; padding: 1rem; margin-bottom: 1rem; background: #fff; }
      pre { background: #f3f4f6; padding: 1rem; overflow: auto; border-radius: 8px; }
      .meta { color: #374151; font-size: 0.95rem; }
    </style>
  </head>
  <body>
    <main aria-label="EmpathyMachine dashboard">
      <h1>EmpathyMachine Runtime Dashboard</h1>
      <p class="meta">Local observability surface for event audit trails.</p>
      <div class="card" role="status" aria-live="polite">
      <strong>Total events:</strong> ${totalEvents}
      </div>
      <div class="card">
        <h2>Recent events</h2>
        <pre aria-label="Recent event log lines">${recentEvents}</pre>
      </div>
    </main>
  </body>
</html>`;
}

const server = createServer(async (req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  const events = await readAuditEvents(EVENT_LOG_PATH);
  const recent = events
    .slice(-20)
    .map((event) => escapeHtml(JSON.stringify(event)))
    .join("\n");

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(renderHtml(events.length, recent || "No events yet."));
});

server.listen(PORT, () => {
  console.info(`[web] listening on http://localhost:${PORT}`);
});
