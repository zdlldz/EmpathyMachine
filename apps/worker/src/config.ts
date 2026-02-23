import type { RuntimeConfig } from "@empathy-machine/shared-types";

function envFlag(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

function envNumber(name: string, fallback: number, bounds?: { min?: number; max?: number }): number {
  const raw = process.env[name];
  const parsed = raw === undefined ? fallback : Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  const min = bounds?.min ?? Number.NEGATIVE_INFINITY;
  const max = bounds?.max ?? Number.POSITIVE_INFINITY;
  return Math.max(min, Math.min(max, parsed));
}

export function loadRuntimeConfig(): RuntimeConfig {
  return {
    blueskyServiceUrl: process.env.BLUESKY_SERVICE_URL ?? "https://bsky.social",
    blueskyIdentifier: process.env.BLUESKY_IDENTIFIER,
    blueskyPassword: process.env.BLUESKY_PASSWORD,
    proactiveQuery: process.env.PROACTIVE_QUERY,
    proactiveLimit: envNumber("PROACTIVE_LIMIT", 10, { min: 1, max: 50 }),
    eventLogPath: process.env.EVENT_LOG_PATH ?? ".runtime/events.jsonl",
    sentimentMinConfidence: envNumber("SENTIMENT_MIN_CONFIDENCE", 0.5, { min: 0, max: 1 }),
    maxRepliesPerTick: envNumber("MAX_REPLIES_PER_TICK", 5, { min: 1, max: 50 }),
    flags: {
      autonomousMode: envFlag("AUTONOMOUS_MODE", true),
      hitlMode: envFlag("HITL_MODE", false),
      proactiveMode: envFlag("PROACTIVE_MODE", true),
      webUiEnabled: envFlag("WEB_UI_ENABLED", true),
      sentimentEnabled: envFlag("SENTIMENT_ENABLED", true),
    },
  };
}
