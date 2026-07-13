import { afterEach, describe, expect, it } from "vitest";
import { generateWithFallback } from "../src/lib/providers";

const request = {
  action: "generate-listing" as const,
  evidenceIds: ["EV-PINTEREST-2026-VAMP-ROMANTIC"],
};

afterEach(() => {
  delete process.env.BAILIAN_API_KEY;
  delete process.env.BAILIAN_MODEL;
  process.env.CULTURENAIL_PROVIDER = "mock";
});

describe("provider safety", () => {
  it("runs mock mode with no key", async () => {
    process.env.CULTURENAIL_PROVIDER = "mock";
    const output = await generateWithFallback(request);
    expect(output.meta.usedProvider).toBe("mock");
    expect(output.data.evidenceIds).toEqual(request.evidenceIds);
  });

  it("falls back without attempting an unconfigured Bailian call", async () => {
    process.env.CULTURENAIL_PROVIDER = "bailian";
    const output = await generateWithFallback(request);
    expect(output.meta.requestedProvider).toBe("bailian");
    expect(output.meta.usedProvider).toBe("mock");
    expect(output.meta.fallbackReason).toBe("bailian_not_configured");
  });
});
