import type { AgentDraft, InboundEvent } from "@empathy-machine/shared-types";
import { createAgent, resumeSession } from "@letta-ai/letta-code-sdk";

export type MemoryAgentProvider = {
  name: string;
  draftResponse: (event: InboundEvent) => Promise<AgentDraft>;
};

function buildEmpathyPrompt(event: InboundEvent): string {
  return [
    "You are EmpathyMachine.",
    "Respond with calm, grounded kindness and de-escalation.",
    "Avoid moralizing and avoid overtly religious language.",
    "Keep response under 450 characters.",
    `Conversation context: ${event.text}`,
  ].join("\n");
}

export function createLocalMemoryAgentProvider(): MemoryAgentProvider {
  return {
    name: "local-memory-provider",
    async draftResponse(event) {
      const text = [
        "I hear you.",
        "Thanks for sharing your perspective.",
        "I want to respond with care and curiosity.",
      ].join(" ");

      return {
        provider: "local-memory-provider",
        text: `${text} (context: ${event.text.slice(0, 80)})`,
      };
    },
  };
}

export function createLettaMemoryAgentProvider(): MemoryAgentProvider {
  let sessionPromise: ReturnType<typeof resumeSession> | null = null;

  async function getSession() {
    if (sessionPromise) return sessionPromise;

    const configuredAgentId = process.env.LETTA_AGENT_ID;
    if (configuredAgentId) {
      sessionPromise = resumeSession(configuredAgentId);
      return sessionPromise;
    }

    const agentId = await createAgent({
      persona:
        "You are EmpathyMachine, a de-escalation-first, kindness-oriented conversational assistant.",
      memfs: true,
      skillSources: ["project", "global"],
      systemInfoReminder: false,
      model: process.env.LETTA_MODEL,
    });
    sessionPromise = resumeSession(agentId);
    return sessionPromise;
  }

  return {
    name: "letta-memory-provider",
    async draftResponse(event) {
      try {
        const session = await getSession();
        await session.send(buildEmpathyPrompt(event));

        let lastAssistantMessage = "";
        for await (const message of session.stream()) {
          if (message.type === "assistant") {
            lastAssistantMessage = message.content;
          }
          if (message.type === "result") {
            break;
          }
        }

        if (!lastAssistantMessage) {
          throw new Error("No assistant response returned from Letta stream");
        }

        return {
          provider: "letta-memory-provider",
          text: lastAssistantMessage,
        };
      } catch (error) {
        const fallback = createLocalMemoryAgentProvider();
        const fallbackDraft = await fallback.draftResponse(event);
        return {
          provider: "letta-memory-provider-fallback",
          text: fallbackDraft.text,
          tokensUsed: undefined,
        };
      }
    },
  };
}

export function createMemoryAgentProvider(): MemoryAgentProvider {
  const useLetta = (process.env.LETTA_ENABLED ?? "false").toLowerCase() === "true";
  return useLetta ? createLettaMemoryAgentProvider() : createLocalMemoryAgentProvider();
}
