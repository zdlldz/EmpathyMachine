export type SentimentLabel = "positive" | "neutral" | "negative" | "unknown";

export type InboundEvent = {
  id: string;
  source: "mention" | "proactive";
  actorDid: string;
  actorHandle?: string;
  conversationId: string;
  text: string;
  createdAt: string;
  metadata?: Record<string, string>;
};

export type SentimentResult = {
  label: SentimentLabel;
  score: number;
  confidence: number;
  reasons: string[];
};

export type PolicyDecision = {
  action: "engage" | "suppress" | "review";
  reason: string;
  tags: string[];
};

export type AgentDraft = {
  text: string;
  tokensUsed?: number;
  provider: string;
};

export type PublishResult = {
  published: boolean;
  postUri?: string;
  reason?: string;
};

export type AuditEvent = {
  eventId: string;
  kind:
    | "inbound_seen"
    | "sentiment_scored"
    | "policy_decision"
    | "draft_created"
    | "publish_result"
    | "dead_lettered"
    | "error";
  timestamp: string;
  conversationId: string;
  payload: Record<string, unknown>;
};
