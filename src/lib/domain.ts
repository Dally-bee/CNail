export type Confidence = "low" | "medium" | "high";

export interface EvidenceRecord {
  id: string;
  sourceTitle: string;
  sourceUrl: string;
  publisher: string;
  capturedAt: string;
  publishedAt?: string;
  market: "US" | "GLOBAL_PLATFORM";
  metric: {
    name: string;
    value: string;
    unit: string;
    interpretation: string;
  };
  summary: string;
  limitations: string[];
  confidence: Confidence;
  contextIds: string[];
}

export interface CulturalContext {
  id: "halloween-party" | "everyday-goth" | "dia-de-muertos";
  name: string;
  meaning: string;
  audienceSituations: string[];
  appropriateUses: string[];
  avoidances: string[];
  sensitivityNotes: string[];
  evidenceIds: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  market: "US";
  category: "press-on-nails";
  season: "2026-Q4";
  contextIds: CulturalContext["id"][];
  evidenceIds: string[];
  rationale: string[];
  uncertainties: string[];
  status: "candidate" | "selected" | "rejected";
}

export interface ConceptPack {
  id: string;
  opportunityId: string;
  name: string;
  audience: string;
  occasion: string;
  palette: string[];
  motifs: string[];
  finishes: string[];
  avoid: string[];
  culturalGuardrails: string[];
  testPlan: string[];
  evidenceIds: string[];
  disclaimer: string;
}

export interface SyntheticPersona {
  id: string;
  simulationLabel: "AI_SIMULATION";
  side: "US_CONSUMER" | "CN_SELLER";
  roleName: string;
  profile: string;
  goals: string[];
  constraints: string[];
  culturalNotes: string[];
}

export interface SyntheticResponse {
  id: string;
  simulationLabel: "AI_SIMULATION";
  personaId: string;
  conceptPackId: string;
  scores: Record<string, number>;
  positives: string[];
  concerns: string[];
  evidenceIds: string[];
  confidence: "low" | "medium";
  disclaimer: string;
}

export type ModelProvider = "mock" | "bailian";
export type GenerateAction =
  | "analyze-context"
  | "generate-concepts"
  | "evaluate-synthetic"
  | "generate-listing";

export interface GenerateRequest {
  action: GenerateAction;
  evidenceIds: string[];
  selectedId?: string;
}

export interface ProviderResult {
  headline: string;
  summary: string;
  bullets: string[];
  evidenceIds: string[];
}

export interface ProviderMeta {
  requestedProvider: ModelProvider;
  usedProvider: ModelProvider;
  fallbackReason?: string;
  latencyMs: number;
  evidenceIds: string[];
  snapshotVersion: "2026-07-13.v1";
}

export interface Provider {
  readonly id: ModelProvider;
  generate(request: GenerateRequest, signal: AbortSignal): Promise<ProviderResult>;
}
