import type {
  InboundEvent,
  PolicyDecision,
  RuntimeConfig,
  SentimentResult,
} from "@empathy-machine/shared-types";

const SUPPRESSED_TERMS = ["self-harm", "kill yourself", "terrorism"];

export function decideEngagement(
  event: InboundEvent,
  sentiment: SentimentResult,
  config: RuntimeConfig,
): PolicyDecision {
  const text = event.text.toLowerCase();
  if (!text.trim()) {
    return {
      action: "suppress",
      reason: "No textual content to safely respond to",
      tags: ["input", "empty-text"],
    };
  }
  const suppressHit = SUPPRESSED_TERMS.find((term) => text.includes(term));

  if (suppressHit) {
    return {
      action: config.flags.hitlMode ? "review" : "suppress",
      reason: `Suppressed due to protected category match: ${suppressHit}`,
      tags: ["safety", "protected-category"],
    };
  }

  if (config.flags.sentimentEnabled && sentiment.confidence < config.sentimentMinConfidence) {
    return {
      action: "suppress",
      reason: "Sentiment confidence below minimum threshold",
      tags: ["sentiment", "low-confidence"],
    };
  }

  return {
    action: config.flags.hitlMode ? "review" : "engage",
    reason: "Policy checks passed",
    tags: ["default-allow"],
  };
}
