import { BskyAgent } from "@atproto/api";
import type {
  InboundEvent,
  PublishResult,
  RuntimeConfig,
} from "@empathy-machine/shared-types";

export type BlueskyAdapter = {
  fetchMentions: () => Promise<InboundEvent[]>;
  fetchProactiveCandidates: () => Promise<InboundEvent[]>;
  publishReply: (event: InboundEvent, replyText: string) => Promise<PublishResult>;
};

async function withRetry<T>(
  operationName: string,
  operation: () => Promise<T>,
  attempts = 3,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === attempts) {
        break;
      }

      // Bounded exponential backoff with jitter.
      const baseDelayMs = 200 * 2 ** (attempt - 1);
      const jitterMs = Math.floor(Math.random() * 120);
      const delayMs = baseDelayMs + jitterMs;
      console.warn("[network-bluesky] retrying operation", {
        operationName,
        attempt,
        delayMs,
      });
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Unknown error in ${operationName}`);
}

function recordText(record: unknown): string {
  if (!record || typeof record !== "object") return "";
  const maybeText = (record as Record<string, unknown>).text;
  return typeof maybeText === "string" ? maybeText : "";
}

function recordReplyRefs(record: unknown): {
  rootUri?: string;
  rootCid?: string;
  parentUri?: string;
  parentCid?: string;
} {
  if (!record || typeof record !== "object") return {};
  const reply = (record as Record<string, unknown>).reply as Record<string, unknown> | undefined;
  if (!reply) return {};

  const root = reply.root as Record<string, unknown> | undefined;
  const parent = reply.parent as Record<string, unknown> | undefined;

  return {
    rootUri: typeof root?.uri === "string" ? root.uri : undefined,
    rootCid: typeof root?.cid === "string" ? root.cid : undefined,
    parentUri: typeof parent?.uri === "string" ? parent.uri : undefined,
    parentCid: typeof parent?.cid === "string" ? parent.cid : undefined,
  };
}

function makeEventFromNotification(notification: {
  uri: string;
  cid: string;
  reason: string;
  reasonSubject?: string;
  indexedAt: string;
  author: { did: string; handle?: string };
  record: unknown;
}): InboundEvent {
  const replyRefs = recordReplyRefs(notification.record);
  return {
    id: notification.uri,
    source: "mention",
    actorDid: notification.author.did,
    actorHandle: notification.author.handle,
    conversationId: notification.reasonSubject ?? notification.uri,
    text: recordText(notification.record),
    createdAt: notification.indexedAt,
    metadata: {
      uri: notification.uri,
      cid: notification.cid,
      reason: notification.reason,
      ...(replyRefs.rootUri ? { rootUri: replyRefs.rootUri } : {}),
      ...(replyRefs.rootCid ? { rootCid: replyRefs.rootCid } : {}),
      ...(replyRefs.parentUri ? { parentUri: replyRefs.parentUri } : {}),
      ...(replyRefs.parentCid ? { parentCid: replyRefs.parentCid } : {}),
    },
  };
}

function makeEventFromSearchPost(post: {
  uri: string;
  cid: string;
  indexedAt: string;
  author: { did: string; handle?: string };
  record: unknown;
}): InboundEvent {
  const replyRefs = recordReplyRefs(post.record);
  return {
    id: post.uri,
    source: "proactive",
    actorDid: post.author.did,
    actorHandle: post.author.handle,
    conversationId: post.uri,
    text: recordText(post.record),
    createdAt: post.indexedAt,
    metadata: {
      uri: post.uri,
      cid: post.cid,
      ...(replyRefs.rootUri ? { rootUri: replyRefs.rootUri } : {}),
      ...(replyRefs.rootCid ? { rootCid: replyRefs.rootCid } : {}),
      ...(replyRefs.parentUri ? { parentUri: replyRefs.parentUri } : {}),
      ...(replyRefs.parentCid ? { parentCid: replyRefs.parentCid } : {}),
    },
  };
}

export function createBlueskyAdapter(config: RuntimeConfig): BlueskyAdapter {
  const agent = new BskyAgent({
    service: config.blueskyServiceUrl,
  });
  let loggedIn = false;
  let loginPromise: Promise<boolean> | null = null;

  async function ensureLogin(): Promise<boolean> {
    if (loggedIn) return true;
    if (loginPromise) return loginPromise;
    if (!config.blueskyIdentifier || !config.blueskyPassword) {
      console.info("[network-bluesky] credentials not set; using no-op mode");
      return false;
    }
    const identifier = config.blueskyIdentifier;
    const password = config.blueskyPassword;

    loginPromise = withRetry("login", async () => {
      await agent.login({
        identifier,
        password,
      });
      loggedIn = true;
      return true;
    });

    try {
      return await loginPromise;
    } finally {
      loginPromise = null;
    }
  }

  return {
    async fetchMentions() {
      const canRun = await ensureLogin();
      if (!canRun) return [];

      const response = await withRetry("listNotifications", () =>
        agent.listNotifications({
          reasons: ["mention", "reply"],
          limit: 50,
        }),
      );

      return response.data.notifications
        .filter((notification) => notification.author.did !== agent.did)
        .filter((notification) => notification.reason === "mention" || notification.reason === "reply")
        .map((notification) =>
          makeEventFromNotification({
            uri: notification.uri,
            cid: notification.cid,
            reason: notification.reason,
            reasonSubject: notification.reasonSubject,
            indexedAt: notification.indexedAt,
            author: {
              did: notification.author.did,
              handle: notification.author.handle,
            },
            record: notification.record,
          }),
        );
    },
    async fetchProactiveCandidates() {
      const canRun = await ensureLogin();
      if (!canRun || !config.proactiveQuery) return [];
      const query = config.proactiveQuery;

      const response = await withRetry("searchPosts", () =>
        agent.app.bsky.feed.searchPosts({
          q: query,
          limit: config.proactiveLimit,
          sort: "latest",
        }),
      );

      return response.data.posts
        .filter((post) => post.author.did !== agent.did)
        .map((post) =>
          makeEventFromSearchPost({
            uri: post.uri,
            cid: post.cid,
            indexedAt: post.indexedAt,
            author: { did: post.author.did, handle: post.author.handle },
            record: post.record,
          }),
        );
    },
    async publishReply(event, replyText) {
      const canRun = await ensureLogin();
      if (!canRun) {
        return { published: false, reason: "Bluesky credentials missing" };
      }

      const parentUri = event.metadata?.parentUri ?? event.metadata?.uri;
      const parentCid = event.metadata?.parentCid ?? event.metadata?.cid;
      const rootUri = event.metadata?.rootUri ?? parentUri;
      const rootCid = event.metadata?.rootCid ?? parentCid;

      if (!parentUri || !parentCid || !rootUri || !rootCid) {
        return { published: false, reason: "Missing post reference metadata for reply" };
      }

      const created = await withRetry("publishReply", () =>
        agent.post({
          text: replyText,
          reply: {
            root: { uri: rootUri, cid: rootCid },
            parent: { uri: parentUri, cid: parentCid },
          },
        }),
      );

      console.info("[network-bluesky] publishReply", {
        conversationId: event.conversationId,
        preview: replyText.slice(0, 80),
      });
      return { published: true, postUri: created.uri };
    },
  };
}
