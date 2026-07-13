import evidence from "@/data/evidence.v1.json";
import type { GenerateAction, GenerateRequest } from "@/lib/domain";
import { generateWithFallback } from "@/lib/providers";

export const runtime = "nodejs";

const actions = new Set<GenerateAction>(["analyze-context", "generate-concepts", "evaluate-synthetic", "generate-listing"]);
const knownEvidence = new Set(evidence.map((item) => item.id));

function isRequest(value: unknown): value is GenerateRequest {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<GenerateRequest>;
  return (
    actions.has(candidate.action as GenerateAction) &&
    Array.isArray(candidate.evidenceIds) &&
    candidate.evidenceIds.length > 0 &&
    candidate.evidenceIds.length <= 20 &&
    candidate.evidenceIds.every((id) => typeof id === "string" && knownEvidence.has(id)) &&
    (candidate.selectedId === undefined || typeof candidate.selectedId === "string")
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!isRequest(body)) return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  const result = await generateWithFallback(body);
  return Response.json({ ok: true, ...result });
}
