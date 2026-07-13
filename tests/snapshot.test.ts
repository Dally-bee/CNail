import { describe, expect, it } from "vitest";
import demo from "../src/data/demo.v1.json";
import evidenceJson from "../src/data/evidence.v1.json";
import personasJson from "../src/data/personas.v1.json";
import type { CulturalContext, EvidenceRecord, SyntheticPersona } from "../src/lib/domain";
import { validateSnapshot } from "../src/lib/validation";

describe("versioned CultureNail snapshot", () => {
  it("keeps evidence traceable and synthetic research explicit", () => {
    const errors = validateSnapshot({
      evidence: evidenceJson as EvidenceRecord[],
      contexts: demo.contexts as CulturalContext[],
      personas: personasJson as SyntheticPersona[],
      conclusionEvidenceIds: [...demo.opportunity.evidenceIds, ...demo.concept.evidenceIds],
    });
    expect(errors).toEqual([]);
  });

  it("never represents Google Trends as sales if added later", () => {
    for (const item of evidenceJson) {
      if (/google trends/i.test(`${item.publisher} ${item.sourceTitle}`)) {
        expect(item.metric.interpretation.toLowerCase()).toContain("relative");
        expect(item.metric.interpretation.toLowerCase()).not.toContain("sales");
      }
    }
  });
});
