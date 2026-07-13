import type { GenerateRequest, Provider, ProviderResult } from "@/lib/domain";

function extractJson(content: string): ProviderResult {
  const parsed = JSON.parse(content) as Partial<ProviderResult>;
  if (
    typeof parsed.headline !== "string" ||
    typeof parsed.summary !== "string" ||
    !Array.isArray(parsed.bullets) ||
    !parsed.bullets.every((item) => typeof item === "string") ||
    !Array.isArray(parsed.evidenceIds) ||
    !parsed.evidenceIds.every((item) => typeof item === "string")
  ) {
    throw new Error("invalid_provider_output");
  }
  return parsed as ProviderResult;
}

export const bailianProvider: Provider = {
  id: "bailian",
  async generate(request: GenerateRequest, signal: AbortSignal) {
    const apiKey = process.env.BAILIAN_API_KEY;
    const model = process.env.BAILIAN_MODEL;
    if (!apiKey || !model) throw new Error("bailian_not_configured");

    const baseUrl = (process.env.BAILIAN_BASE_URL ?? "https://dashscope.aliyuncs.com/compatible-mode/v1").replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      signal,
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "Return strict JSON with headline, summary, bullets, evidenceIds. Use only supplied evidence IDs. Never claim sales, bestseller prediction, real-user validation, or equate Dia de Muertos with Halloween horror.",
          },
          { role: "user", content: JSON.stringify(request) },
        ],
      }),
    });

    if (!response.ok) throw new Error(`bailian_http_${response.status}`);
    const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("empty_provider_output");
    return extractJson(content);
  },
};
