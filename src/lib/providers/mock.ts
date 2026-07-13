import type { GenerateAction, GenerateRequest, Provider, ProviderResult } from "@/lib/domain";

const fixtures: Record<GenerateAction, Omit<ProviderResult, "evidenceIds">> = {
  "analyze-context": {
    headline: "同一骷髅符号，必须拆成三种文化语境",
    summary: "派对表达、日常哥特与亡灵节纪念语境不可混写；后者需要独立的尊重性护栏。",
    bullets: ["万圣节：短周期、派对可见度", "日常哥特：可跨季搭配", "亡灵节：纪念、家庭与文化传统优先"],
  },
  "generate-concepts": {
    headline: "Midnight Relic / 午夜遗迹",
    summary: "以骨白线稿、烟黑底色与少量金属铬为核心的短杏仁甲概念，先进入人工选款与小批打样。",
    bullets: ["避免血腥写实", "提供短款与中款两个甲型假设", "不使用受保护角色或真实性承诺"],
  },
  "evaluate-synthetic": {
    headline: "17 个模拟情景完成双边压力测试",
    summary: "重复顾虑集中在日常可穿戴性、文化语境说明、尺寸清晰度与工艺复杂度；这不是市场比例。",
    bullets: ["12 名美国女性消费者模拟角色", "5 名中国跨境卖家模拟角色", "文化尊重低于门槛则必须返修"],
  },
  "generate-listing": {
    headline: "Midnight Relic Press-On Nails — Short Almond",
    summary: "Bone-white linework and smoke-black gloss for Halloween parties and everyday gothic styling. Concept copy for human review.",
    bullets: ["Size coverage hypothesis pending physical sampling and fit validation", "Short almond concept for easier daily wear", "No bestseller, sales, material or cultural-authenticity claims"],
  },
};

export const mockProvider: Provider = {
  id: "mock",
  async generate(request: GenerateRequest, signal: AbortSignal) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    return { ...fixtures[request.action], evidenceIds: request.evidenceIds };
  },
};
