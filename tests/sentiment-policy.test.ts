import assert from "node:assert/strict";
import test from "node:test";

import { decideEngagement } from "@empathy-machine/policy-engine";
import { analyzeConversationSentiment } from "@empathy-machine/sentiment-engine";
import type { InboundEvent, RuntimeConfig } from "@empathy-machine/shared-types";

function baseEvent(text: string): InboundEvent {
  return {
    id: "evt-1",
    source: "mention",
    actorDid: "did:plc:test",
    conversationId: "conv-1",
    text,
    createdAt: new Date().toISOString(),
    metadata: {},
  };
}

function baseConfig(): RuntimeConfig {
  return {
    blueskyServiceUrl: "https://bsky.social",
    proactiveLimit: 10,
    eventLogPath: ".runtime/events.jsonl",
    sentimentMinConfidence: 0.5,
    maxRepliesPerTick: 5,
    flags: {
      autonomousMode: true,
      hitlMode: false,
      proactiveMode: true,
      webUiEnabled: true,
      sentimentEnabled: true,
    },
  };
}

test("sentiment analyzer returns positive label for positive phrases", () => {
  const sentiment = analyzeConversationSentiment(baseEvent("Thank you, I appreciate your kind help."));
  assert.equal(sentiment.label, "positive");
  assert.ok(sentiment.confidence >= 0.5);
});

test("policy suppresses protected categories", () => {
  const event = baseEvent("You should kill yourself");
  const sentiment = analyzeConversationSentiment(event);
  const decision = decideEngagement(event, sentiment, baseConfig());
  assert.equal(decision.action, "suppress");
  assert.ok(decision.tags.includes("safety"));
});

test("policy can require review in HITL mode", () => {
  const event = baseEvent("This is hard, but I am trying.");
  const sentiment = analyzeConversationSentiment(event);
  const config = baseConfig();
  config.flags.hitlMode = true;
  config.flags.sentimentEnabled = false;
  const decision = decideEngagement(event, sentiment, config);
  assert.equal(decision.action, "review");
});
