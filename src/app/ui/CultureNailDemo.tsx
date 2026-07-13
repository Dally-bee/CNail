"use client";

import { useMemo, useState } from "react";
import type { EvidenceRecord, ProviderMeta, ProviderResult } from "@/lib/domain";
import styles from "./CultureNailDemo.module.css";

type DemoData = typeof import("@/data/demo.v1.json");
type Persona = (typeof import("@/data/personas.v1.json"))[number];

const steps = ["机会雷达", "文化语境", "概念套装", "合成研究", "Listing"];
const actions = ["analyze-context", "generate-concepts", "evaluate-synthetic", "generate-listing"] as const;

export default function CultureNailDemo({ demo, evidence, personas }: { demo: DemoData; evidence: EvidenceRecord[]; personas: Persona[] }) {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ProviderResult | null>(null);
  const [meta, setMeta] = useState<ProviderMeta | null>(null);
  const [openEvidence, setOpenEvidence] = useState<string | null>(null);
  const [notice, setNotice] = useState("固定证据快照已就绪");

  const selectedEvidence = useMemo(() => evidence.find((item) => item.id === openEvidence), [evidence, openEvidence]);
  const evidenceIds = demo.opportunity.evidenceIds;

  async function advance() {
    if (step === 4) {
      setStep(0); setResult(null); setMeta(null); setNotice("演示已重置到本地证据快照"); return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actions[step], evidenceIds, selectedId: step > 0 ? demo.concept.id : demo.opportunity.id }),
      });
      if (!response.ok) throw new Error("api_unavailable");
      const payload = (await response.json()) as { data: ProviderResult; meta: ProviderMeta };
      setResult(payload.data); setMeta(payload.meta);
      setNotice(payload.meta.fallbackReason ? `已安全回退：${payload.meta.fallbackReason}` : `${payload.meta.usedProvider.toUpperCase()} 响应完成`);
    } catch {
      setNotice("服务不可用，继续使用页面内置快照");
    } finally {
      setBusy(false); setStep((current) => Math.min(current + 1, 4));
    }
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}><span className={styles.mark}>CN</span><div><b>CultureNail</b><small>US CULTURE-TO-COMMERCE LAB</small></div></div>
        <div className={styles.runState}><i /> MOCK SAFE MODE <span>·</span> 2026 Q4 / AMAZON US</div>
      </header>

      <nav className={styles.progress} aria-label="演示步骤">
        {steps.map((label, index) => <button key={label} onClick={() => index <= step && setStep(index)} data-active={index === step} data-done={index < step}><span>0{index + 1}</span>{label}</button>)}
      </nav>

      <section className={styles.workspace}>
        <aside className={styles.rail}>
          <span className={styles.kicker}>LIVE BRIEF</span>
          <h1>{steps[step]}</h1>
          <p>{["从公开证据识别可测试机会，而不是预测爆款。", "先拆语境，再做商品；相似符号不代表相同文化含义。", "把信号收敛为可进入人工选款与打样的概念。", "用 12+5 个模拟情景暴露顾虑，不冒充真实访谈。", "生成可复核的 Amazon US 文案草稿，每条结论保留证据 ID。 "][step]}</p>
          <div className={styles.status}><span>{notice}</span>{meta && <small>{meta.usedProvider} · {meta.latencyMs}ms · {meta.snapshotVersion}</small>}</div>
          <button className={styles.primary} onClick={advance} disabled={busy}>{busy ? "生成中…" : step === 4 ? "重置演示" : `进入 ${steps[step + 1]}`}<span>↗</span></button>
          <button className={styles.secondary} onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>返回上一步</button>
        </aside>

        <div className={styles.stage}>
          {step === 0 && <Radar evidence={evidence} open={setOpenEvidence} />}
          {step === 1 && <Contexts contexts={demo.contexts} open={setOpenEvidence} />}
          {step === 2 && <Concept concept={demo.concept} result={result} open={setOpenEvidence} />}
          {step === 3 && <Synthetic personas={personas} result={result} />}
          {step === 4 && <Listing result={result} evidenceIds={demo.concept.evidenceIds} open={setOpenEvidence} />}
        </div>
      </section>

      {selectedEvidence && <div className={styles.drawerBackdrop} onClick={() => setOpenEvidence(null)}><aside className={styles.drawer} onClick={(event) => event.stopPropagation()}><button className={styles.close} onClick={() => setOpenEvidence(null)}>×</button><span className={styles.kicker}>{selectedEvidence.id}</span><h2>{selectedEvidence.sourceTitle}</h2><p>{selectedEvidence.summary}</p><dl><dt>指标</dt><dd>{selectedEvidence.metric.value}<small>{selectedEvidence.metric.interpretation}</small></dd><dt>采集时间 / 市场</dt><dd>{selectedEvidence.capturedAt} · {selectedEvidence.market}</dd><dt>局限</dt><dd>{selectedEvidence.limitations.join("；")}</dd><dt>置信度</dt><dd>{selectedEvidence.confidence}</dd></dl><a href={selectedEvidence.sourceUrl} target="_blank" rel="noreferrer">打开公开来源 ↗</a></aside></div>}
    </main>
  );
}

function EvidenceLinks({ ids, open }: { ids: string[]; open: (id: string) => void }) {
  return <div className={styles.evidenceLinks}>{ids.map((id) => <button key={id} onClick={() => open(id)}>{id}</button>)}</div>;
}

function Radar({ evidence, open }: { evidence: EvidenceRecord[]; open: (id: string) => void }) {
  return <div className={styles.radar}><div className={styles.radarHead}><div><span className={styles.kicker}>OPPORTUNITY 01 / 03</span><h2>骷髅符号的<br />三语境机会</h2></div><div className={styles.score}><strong>可测试</strong><span>证据支持的机会假设<br />非销量预测</span></div></div><div className={styles.signalList}>{evidence.slice(0, 5).map((item, index) => <button key={item.id} onClick={() => open(item.id)}><span>0{index + 1}</span><div><b>{item.publisher}</b><p>{item.summary}</p></div><em>{item.confidence}</em></button>)}</div></div>;
}

function Contexts({ contexts, open }: { contexts: DemoData["contexts"]; open: (id: string) => void }) {
  return <div className={styles.contexts}>{contexts.map((context, index) => <article key={context.id} data-sensitive={index === 2}><div className={styles.contextIndex}>0{index + 1}</div><span className={styles.kicker}>{index === 2 ? "SENSITIVITY GATE" : "CONTEXT LANE"}</span><h2>{context.name}</h2><p>{context.meaning}</p><h3>可用表达</h3><ul>{context.appropriateUses.map((item) => <li key={item}>{item}</li>)}</ul><h3>禁止简化</h3><ul className={styles.avoid}>{context.avoidances.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul><EvidenceLinks ids={context.evidenceIds} open={open} /></article>)}</div>;
}

function Concept({ concept, result, open }: { concept: DemoData["concept"]; result: ProviderResult | null; open: (id: string) => void }) {
  return <div className={styles.concept}><div className={styles.nails} aria-label="午夜遗迹甲片概念示意"><i /><i /><i /><i /><i /></div><div className={styles.conceptCopy}><span className={styles.kicker}>CONCEPT PACK / HUMAN GATE</span><h2>{result?.headline ?? concept.name}</h2><p>{result?.summary ?? concept.audience}</p><div className={styles.palette}>{concept.palette.map((color, index) => <span key={color} style={{ "--swatch": ["#171717", "#e9e4d8", "#8c8a86", "#5a1327"][index] } as React.CSSProperties}>{color}</span>)}</div><h3>设计边界</h3><ul>{(result?.bullets ?? concept.culturalGuardrails).map((item) => <li key={item}>{item}</li>)}</ul><p className={styles.disclaimer}>{concept.disclaimer}</p><EvidenceLinks ids={concept.evidenceIds} open={open} /></div></div>;
}

function Synthetic({ personas, result }: { personas: Persona[]; result: ProviderResult | null }) {
  const consumers = personas.filter((item) => item.side === "US_CONSUMER");
  const sellers = personas.filter((item) => item.side === "CN_SELLER");
  return <div className={styles.synthetic}><div className={styles.simHeader}><div><span className={styles.kicker}>AI_SIMULATION / NOT REAL INTERVIEWS</span><h2>双边情景压力测试</h2></div><div><strong>12</strong><span>美国女性<br />模拟消费者</span><strong>5</strong><span>中国跨境<br />模拟卖家</span></div></div><p className={styles.simSummary}>{result?.summary ?? "用于暴露潜在偏好、执行约束与文化风险，不代表市场比例、购买意向验证或销量预测。"}</p><div className={styles.personaBands}><PersonaBand title="CONSUMER LENS" items={consumers} /><PersonaBand title="SELLER LENS" items={sellers} /></div><div className={styles.matrix}><span>文化匹配</span><span>视觉吸引</span><span>场景适配</span><span>可穿戴性</span><span>价值感知</span><span>Listing 清晰度</span><span>文化尊重*</span><span>小测就绪度</span></div><p className={styles.disclaimer}>* 文化尊重为硬门槛。合成评分只用于方案内排序，不能外推为消费者占比。</p></div>;
}

function PersonaBand({ title, items }: { title: string; items: Persona[] }) {
  return <div><h3>{title}</h3><div>{items.map((item) => <span key={item.id} title={`${item.roleName}：${item.profile}`}>{item.id.replace("-", "")}</span>)}</div></div>;
}

function Listing({ result, evidenceIds, open }: { result: ProviderResult | null; evidenceIds: string[]; open: (id: string) => void }) {
  const bullets = result?.bullets ?? ["Size coverage hypothesis pending physical sampling and fit validation", "Short almond concept for easier daily wear", "Smoke-black gloss with bone-white original linework", "Designed for Halloween parties and everyday gothic styling", "Concept copy — materials and production claims require verification"];
  return <div className={styles.listing}><div className={styles.listingTop}><span className={styles.kicker}>AMAZON US / DRAFT FOR HUMAN REVIEW</span><span className={styles.badge}>NO SALES CLAIMS</span></div><h2>{result?.headline ?? "Midnight Relic Press-On Nails — Short Almond Gothic Skull-Inspired Concept"}</h2><p>{result?.summary ?? "A restrained smoke-black and bone-white press-on nail concept for seasonal parties and everyday dark styling."}</p><ol>{bullets.map((item) => <li key={item}><span>0{bullets.indexOf(item) + 1}</span>{item}</li>)}</ol><div className={styles.listingFoot}><div><b>证据链</b><p>每个 AI 结论必须引用当前快照中的 ID。</p></div><EvidenceLinks ids={evidenceIds} open={open} /></div><p className={styles.disclaimer}>Listing 草稿不包含未经验证的材质、安全、原产地、销量、文化真实性或生产能力声明。</p></div>;
}
