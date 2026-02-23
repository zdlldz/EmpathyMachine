import { createMemoryAgentProvider } from "@empathy-machine/core-agent";
import { readAuditEvents, writeAuditEvent } from "@empathy-machine/event-log";
import { createBlueskyAdapter } from "@empathy-machine/network-bluesky";
import { decideEngagement } from "@empathy-machine/policy-engine";
import { analyzeConversationSentiment } from "@empathy-machine/sentiment-engine";
import { randomUUID } from "node:crypto";
import type { AuditEvent, InboundEvent, RuntimeConfig } from "@empathy-machine/shared-types";

import { loadRuntimeConfig } from "./config.js";

function newAuditEvent(
  kind: AuditEvent["kind"],
  conversationId: string,
  payload: Record<string, unknown>,
): AuditEvent {
  return {
    eventId: randomUUID(),
    kind,
    timestamp: new Date().toISOString(),
    conversationId,
    payload,
  };
}

async function processInboundEvent(
  event: InboundEvent,
  options: {
    agentProvider: ReturnType<typeof createMemoryAgentProvider>;
    config: RuntimeConfig;
    bluesky: ReturnType<typeof createBlueskyAdapter>;
    eventLogPath: string;
    autonomousMode: boolean;
  },
): Promise<void> {
  await writeAuditEvent(
    options.eventLogPath,
    newAuditEvent("inbound_seen", event.conversationId, { event }),
  );

  const sentiment = analyzeConversationSentiment(event);
  await writeAuditEvent(
    options.eventLogPath,
    newAuditEvent("sentiment_scored", event.conversationId, { sentiment }),
  );

  const decision = decideEngagement(event, sentiment, options.config);
  await writeAuditEvent(
    options.eventLogPath,
    newAuditEvent("policy_decision", event.conversationId, { decision }),
  );

  if (decision.action !== "engage") {
    return;
  }

  const draft = await options.agentProvider.draftResponse(event);
  await writeAuditEvent(
    options.eventLogPath,
    newAuditEvent("draft_created", event.conversationId, { draft }),
  );

  if (!options.autonomousMode) {
    await writeAuditEvent(
      options.eventLogPath,
      newAuditEvent("publish_result", event.conversationId, {
        published: false,
        reason: "Autonomous mode disabled",
      }),
    );
    return;
  }

  const result = await options.bluesky.publishReply(event, draft.text);
  await writeAuditEvent(
    options.eventLogPath,
    newAuditEvent("publish_result", event.conversationId, result as Record<string, unknown>),
  );
}

function extractProcessedInboundIds(events: AuditEvent[]): Set<string> {
  const processed = new Set<string>();
  for (const event of events) {
    if (event.kind !== "inbound_seen") continue;
    const maybeInbound = event.payload.event as { id?: string } | undefined;
    if (maybeInbound?.id) {
      processed.add(maybeInbound.id);
    }
  }
  return processed;
}

function uniqueInboundEvents(events: InboundEvent[]): InboundEvent[] {
  const seen = new Set<string>();
  const deduped: InboundEvent[] = [];
  for (const event of events) {
    if (seen.has(event.id)) continue;
    seen.add(event.id);
    deduped.push(event);
  }
  return deduped;
}

export async function runTick(): Promise<void> {
  const config = loadRuntimeConfig();
  const agentProvider = createMemoryAgentProvider();
  const bluesky = createBlueskyAdapter(config);
  // Use prior inbound_seen events as an idempotency ledger across ticks.
  const priorEvents = await readAuditEvents(config.eventLogPath);
  const processedInboundIds = extractProcessedInboundIds(priorEvents);

  const mentions = await bluesky.fetchMentions();
  const proactive = config.flags.proactiveMode ? await bluesky.fetchProactiveCandidates() : [];
  const deduped = uniqueInboundEvents([...mentions, ...proactive]);
  const unprocessed = deduped.filter((event) => !processedInboundIds.has(event.id));
  const events = unprocessed.slice(0, config.maxRepliesPerTick);

  console.info("[worker] tick", {
    mentions: mentions.length,
    proactive: proactive.length,
    deduped: deduped.length,
    unprocessed: unprocessed.length,
    selected: events.length,
    autonomousMode: config.flags.autonomousMode,
    hitlMode: config.flags.hitlMode,
  });

  for (const event of events) {
    try {
      await processInboundEvent(event, {
        agentProvider,
        config,
        bluesky,
        eventLogPath: config.eventLogPath,
        autonomousMode: config.flags.autonomousMode,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await writeAuditEvent(
        config.eventLogPath,
        newAuditEvent("dead_lettered", event.conversationId, {
          inboundEventId: event.id,
          reason: message,
        }),
      );
      await writeAuditEvent(
        config.eventLogPath,
        newAuditEvent("error", event.conversationId, {
          message,
          stage: "processInboundEvent",
          inboundEventId: event.id,
        }),
      );
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runTick().catch(async (error) => {
    const config = loadRuntimeConfig();
    console.error("[worker] fatal", error);
    await writeAuditEvent(
      config.eventLogPath,
      newAuditEvent("error", "global", {
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    process.exitCode = 1;
  });
}
