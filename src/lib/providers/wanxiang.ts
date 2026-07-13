export interface WanxiangImageRequest {
  conceptPackId: string;
  prompt: string;
  evidenceIds: string[];
}

export interface WanxiangImageResult {
  status: "disabled" | "submitted" | "ready";
  assetUrl?: string;
}

// Intentionally disabled in v1. A future server-only adapter may read
// WANXIANG_API_KEY from the environment after explicit user approval.
export async function generateConceptImage(request: WanxiangImageRequest): Promise<WanxiangImageResult> {
  void request;
  return { status: "disabled" };
}
