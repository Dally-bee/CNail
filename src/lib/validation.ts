import type { CulturalContext, EvidenceRecord, SyntheticPersona } from "@/lib/domain";

export function validateSnapshot(input: {
  evidence: EvidenceRecord[];
  contexts: CulturalContext[];
  personas: SyntheticPersona[];
  conclusionEvidenceIds: string[];
}) {
  const errors: string[] = [];
  const evidenceIds = new Set(input.evidence.map((item) => item.id));
  const allReferences = [...input.contexts.flatMap((item) => item.evidenceIds), ...input.conclusionEvidenceIds];

  if (input.evidence.some((item) => !item.sourceUrl || !item.capturedAt || !item.market || !item.metric || !item.limitations.length || !item.confidence)) {
    errors.push("evidence_required_fields");
  }
  if (allReferences.some((id) => !evidenceIds.has(id))) errors.push("dangling_evidence_reference");
  if (input.personas.filter((item) => item.side === "US_CONSUMER").length !== 12) errors.push("consumer_persona_count");
  if (input.personas.filter((item) => item.side === "CN_SELLER").length !== 5) errors.push("seller_persona_count");
  if (input.personas.some((item) => item.simulationLabel !== "AI_SIMULATION")) errors.push("persona_missing_simulation_label");

  const remembrance = input.contexts.find((item) => item.id === "dia-de-muertos");
  if (!remembrance || !/纪念|家庭/.test(`${remembrance.meaning}${remembrance.sensitivityNotes.join(" ")}`) || !remembrance.avoidances.some((item) => /Halloween|万圣节|Mexican/.test(item))) {
    errors.push("dia_de_muertos_guardrail");
  }
  return errors;
}
