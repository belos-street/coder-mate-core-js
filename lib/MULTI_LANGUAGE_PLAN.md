# Coder Mate Core 多语言扩展方案

## 1. 背景与目标

当前 `lib/language/javascript` 已完成一套可用的状态机分词与高亮实现，并且测试覆盖较完整。  
下一阶段目标是支持更多语言（如 JSON / Python / TS / HTML 等），同时避免重复实现解析主流程。

核心目标：

1. 抽离语言无关能力（状态机引擎、行列追踪、跨行拆分）。
2. 语言实现只关注 `rules + metadata`，主题样式独立到 `themes` 层。
3. 保持现有 JavaScript 行为与测试结果不回归。
4. 提供统一入口（按语言 ID 调用 tokenize/highlight）。

## 2. 当前现状评估

当前目录：

```txt
lib/
  core/
  themes/
  language/
    javascript/
      engine.ts
      spec.ts
      rule.ts
      type.ts
      __test__/
```

问题点：

1. 解析引擎逻辑和 JS 语言规则耦合在一起，不利于复用。
2. 类型定义是 JS 专属字面量联合，其他语言复用成本高。
3. 对外缺少统一语言注册/分发机制。
4. 新增语言时会重复写大量 `parse/matchToken/highlight` 逻辑。

## 3. 目标架构

建议架构：

```txt
lib/
  core/
    types.ts         # 通用类型（Token/Rule/Context/LanguageSpec）
    tokenizer.ts     # 通用状态机解析引擎
    registry.ts      # 语言注册与查找
  themes/
    dark-plus.ts     # 默认主题
    github-light.ts  # 新增亮色主题
    index.ts         # 主题注册、查询、scope 样式回退
    types.ts
  language/
    javascript/
      spec.ts        # JS 规则 + 初始化配置
      index.ts       # JS 导出
      __test__/
    json/
      spec.ts
      index.ts
      __test__/
    python/
      spec.ts
      index.ts
      __test__/
    index.ts         # 导出所有语言 spec 并注册
```

## 4. 需要抽象的核心对象

### 4.1 通用类型（`core/types.ts`）

建议抽象：

1. `Token<Scope extends string = string>`
2. `GrammarRule<State extends string = string, Scope extends string = string>`
3. `ParserContext<State extends string = string>`
4. `TokenStream<Scope extends string = string>`
5. `LanguageSpec<State extends string = string, Scope extends string = string>`

`LanguageSpec` 建议字段：

1. `id: string`（如 `javascript`）
2. `displayName: string`
3. `initialState: State`
4. `rules: Record<State, GrammarRule<State, Scope>[]>`

### 4.2 通用引擎（`core/tokenizer.ts`）

从 JS 里抽离：

1. `createInitialContext(initialState)`
2. `pushState / popState / getCurrentState`
3. `splitTokenByLineBreak`
4. `matchToken(code, context, spec)`
5. `parse(code, spec)`
6. `createTokenizer(spec)`（返回 `{ tokenize, parse, highlight }` 或 `{ parse }`）

### 4.3 通用渲染（`src/render.ts` 或上层展示库）

抽离：

1. `escapeHtml(text)`
2. `renderHtml(tokenStream, { theme, options })`
3. `highlight(code, spec, options?)`（可选，或由上层组合）

### 4.4 语言注册中心（`core/registry.ts`）

抽离：

1. `registerLanguage(spec)`
2. `getLanguage(id)`
3. `tokenize(code, languageId)`
4. `highlight(code, languageId)`

## 5. JavaScript 语言包改造方式

目标是把 JS 改造成“薄层”：

1. `javascript/spec.ts`：仅放状态集合和规则表（原 `rule.ts` 迁移）
2. `javascript/index.ts`：语言适配器导出
3. `themes/*`：统一维护样式映射（与语言解耦）

兼容策略：

1. 保留现有导出函数名（如果外部在用），内部改为调用 core。
2. 行为对齐当前测试用例（token 文本、scope、line/col、HTML 结构）。

## 6. 新语言接入模板

每门语言最小实现只需要：

1. 定义 `State` 联合类型
2. 定义 `Scope` 联合类型
3. 实现 `rules`
4. 注册到 `registry`

建议第一个新增语言选 `json`：

1. 语法小、状态少（字符串、数字、布尔、null、标点）
2. 快速验证架构抽象是否合理
3. 能尽早发现跨语言公共层缺陷

## 7. 测试策略

### 7.1 Core 层测试

覆盖通用行为：

1. 状态栈 push/pop
2. token 匹配优先级
3. 跨行 token 拆分（LF/CRLF）
4. 行列追踪连续性
5. fallback token 逻辑

### 7.2 语言层测试

每种语言关注自身语法：

1. 关键语法规则命中
2. 边界情况（未闭合字符串、注释结束、嵌套）
3. 高亮输出快照/关键字段断言

### 7.3 回归与性能

1. 保留现有 JS 集成测试作为回归基线。
2. 性能测试迁移到 core，语言层仅保留 smoke 性能测试。
3. 可考虑引入 fixture + golden 输出（tokens JSON）。

## 8. 分阶段实施计划

### Phase 1（低风险重构）

1. 新建 `core/types.ts`、`core/tokenizer.ts`。
2. 不改 JS 规则，先让 JS 通过 core 跑起来。
3. 保证 JS 全量测试继续通过。

### Phase 2（统一入口）

1. 新建 `core/registry.ts`。
2. 新建 `language/index.ts` 注册 `javascript`。
3. 在 `lib/index.ts` 导出统一 API。

### Phase 3（新增语言）

1. 接入 `json` 语言包并补测试。
2. 接入第二门语言（建议 `python` 或 `typescript`）。
3. 验证抽象是否需要二次调整。

## 9. API 草案（建议）

```ts
// core
export function createTokenizer(spec: LanguageSpec) {
  return {
    parse(code: string): TokenStream,
    highlight(code: string): string
  }
}

// registry
export function registerLanguage(spec: LanguageSpec): void
export function tokenize(code: string, languageId: string): TokenStream
export function highlight(code: string, languageId: string): string
```

## 10. 风险与规避

主要风险：

1. 泛型抽象过度，导致阅读门槛上升。
2. 语言特性差异大（如 Python 缩进、HTML 嵌套），可能突破当前状态机能力边界。
3. 重构期间 API 变化导致外部调用中断。

规避策略：

1. 先“提取复用”，不做大规模行为改造。
2. 保留 JS 测试作为迁移护栏。
3. 先接入 JSON 验证通用层，再上更复杂语言。
4. 对外 API 提供兼容别名，逐步迁移。

## 11. 立即可执行的下一步

1. 实现 `core/types.ts` 与 `core/tokenizer.ts` 初版。
2. 将 JS 从 `main.ts` 迁移到 `spec.ts + index.ts` 形式。
3. 跑通现有 JS 全量测试，确保无回归。
