import type { InboundEvent, SentimentResult } from "@empathy-machine/shared-types";

const POSITIVE_MARKERS = ["thank", "thanks", "love", "appreciate", "kind", "peace"];
const NEGATIVE_MARKERS = ["hate", "stupid", "idiot", "worthless", "die", "kill"];

export function analyzeConversationSentiment(event: InboundEvent): SentimentResult {
  const text = event.text.toLowerCase();
  const positiveHits = POSITIVE_MARKERS.filter((marker) => text.includes(marker));
  const negativeHits = NEGATIVE_MARKERS.filter((marker) => text.includes(marker));

  if (positiveHits.length === 0 && negativeHits.length === 0) {
    return {
      label: "unknown",
      score: 0,
      confidence: 0.4,
      reasons: ["No known sentiment markers found"],
    };
  }

  const score = positiveHits.length - negativeHits.length;
  const confidence = Math.min(1, 0.5 + (positiveHits.length + negativeHits.length) * 0.15);

  return {
    label: score >= 1 ? "positive" : score <= -1 ? "negative" : "neutral",
    score,
    confidence,
    reasons: [
      ...positiveHits.map((hit) => `positive:${hit}`),
      ...negativeHits.map((hit) => `negative:${hit}`),
    ],
  };
}
