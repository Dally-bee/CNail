import type { GenerateRequest, ModelProvider, ProviderMeta, ProviderResult } from "@/lib/domain";
import { bailianProvider } from "./bailian";
import { mockProvider } from "./mock";

const SAFE_REASONS = new Set(["bailian_not_configured", "invalid_provider_output", "empty_provider_output"]);

function safeReason(error: unknown) {
  if (error instanceof DOMException && error.name === "AbortError") return "provider_timeout";
  if (error instanceof Error && SAFE_REASONS.has(error.message)) return error.message;
  if (error instanceof Error && /^bailian_http_(429|5\d\d)$/.test(error.message)) return error.message;
  return "provider_unavailable";
}

export async function generateWithFallback(request: GenerateRequest): Promise<{ data: ProviderResult; meta: ProviderMeta }> {
  const startedAt = performance.now();
  const requestedProvider: ModelProvider = process.env.CULTURENAIL_PROVIDER === "bailian" ? "bailian" : "mock";

  if (requestedProvider === "mock") {
    const data = await mockProvider.generate(request, new AbortController().signal);
    return {
      data,
      meta: { requestedProvider, usedProvider: "mock", latencyMs: Math.round(performance.now() - startedAt), evidenceIds: data.evidenceIds, snapshotVersion: "2026-07-13.v1" },
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const data = await bailianProvider.generate(request, controller.signal);
    const allowed = new Set(request.evidenceIds);
    if (!data.evidenceIds.length || data.evidenceIds.some((id) => !allowed.has(id))) throw new Error("invalid_provider_output");
    return {
      data,
      meta: { requestedProvider, usedProvider: "bailian", latencyMs: Math.round(performance.now() - startedAt), evidenceIds: data.evidenceIds, snapshotVersion: "2026-07-13.v1" },
    };
  } catch (error) {
    const data = await mockProvider.generate(request, new AbortController().signal);
    return {
      data,
      meta: { requestedProvider, usedProvider: "mock", fallbackReason: safeReason(error), latencyMs: Math.round(performance.now() - startedAt), evidenceIds: data.evidenceIds, snapshotVersion: "2026-07-13.v1" },
    };
  } finally {
    clearTimeout(timeout);
  }
}
