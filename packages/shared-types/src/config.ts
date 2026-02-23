export type RuntimeFlags = {
  autonomousMode: boolean;
  hitlMode: boolean;
  proactiveMode: boolean;
  webUiEnabled: boolean;
  sentimentEnabled: boolean;
};

export type RuntimeConfig = {
  blueskyServiceUrl: string;
  blueskyIdentifier?: string;
  blueskyPassword?: string;
  proactiveQuery?: string;
  proactiveLimit: number;
  eventLogPath: string;
  sentimentMinConfidence: number;
  maxRepliesPerTick: number;
  flags: RuntimeFlags;
};
