# CultureNail

面向中国中小跨境卖家的美国文化趋势上新智能体。第一版聚焦 2026 Q4、穿戴甲、Amazon US 与骷髅符号，把带来源和时间的公开证据转换为可进入人工选款和打样的商品概念套装。

> 本项目不预测爆款，不把搜索关注度解释为销量，也不把 AI 合成研究表述为真实用户验证。输出是概念与 Listing 草稿，不是生产级设计稿。

## 赛事状态

- 2026-07-14：初赛 Idea 在线表单已由参赛人确认提交。
- 命题场景：AI智能上新。
- 提交阶段：已有 Demo 原型；尚未进行真实百炼 API 测试。
- 公开仓库：<https://github.com/Dally-bee/CNail>
- 提交记录与材料校验：`docs/initial-round-submission-record-v1.md`

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

访问 <http://localhost:3000>。默认 `CULTURENAIL_PROVIDER=mock`，不需要密钥、网络或模型额度；证据快照和模型响应均可本地回退。

## Provider 边界

- `mock`：默认且确定性，无密钥、无外部请求。
- `bailian`：仅服务端读取 `BAILIAN_API_KEY`、`BAILIAN_BASE_URL`、`BAILIAN_MODEL`。未配置、超时、限流、服务错误或输出校验失败时回退到 mock。
- 万相：仅保留禁用的服务端接口占位，第一版不会提交图像任务。
- 不允许任何密钥使用 `NEXT_PUBLIC_` 前缀。真实百炼调用必须先获得用户明确授权。

## 数据与证据纪律

- `EvidenceRecord` 必含来源 URL、`capturedAt`、市场、指标、局限与置信度。
- AI 结论必须携带当前快照中可解析的 `evidenceIds`。
- 亡灵节与万圣节、日常哥特分属独立语境；纪念、家庭与文化来源是硬护栏。
- 合成角色全部标记 `AI_SIMULATION`，只能用于早期情景压力测试。

## 验证

```bash
npm run typecheck
npm run lint
npm test
npm run build
git diff --check
```

核心材料：

- `docs/idea-submission-v1.md`：初赛 Idea 提交稿
- `docs/initial-round-form-v1.md`：初赛在线表单十项逐字段稿
- `docs/initial-round-submission-record-v1.md`：初赛提交状态与附加材料校验记录
- `docs/synthetic-research-method-v1.md`：12+5 合成研究方法与偏见审计
- `docs/demo-script-v1.md`：4 分钟主演示脚本
- `src/data/evidence.v1.json`：首批趋势与文化证据快照
- `src/data/personas.v1.json`：17 个 AI 模拟角色

## 当前限制

赛事专属百炼 Key 将在初赛通过后发放；当前尚未获得属于正常状态，不构成阻塞。现有 Demo 默认使用 mock Provider，尚未进行真实百炼 API 测试。真实需求、价格、制造可行性、知识产权、Amazon 合规和转化仍需人工与真实市场测试验证。
