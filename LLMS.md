# LLMS.md

> 目标：让任何大模型在最短时间内理解 `coder-mate-core-js` 的定位、结构、关键约束和可扩展点，并能安全地继续开发。

## 1. 项目一句话

这是一个**可扩展的多语言分词核心库**（`lib`）+ 一个用于调试/展示的浏览器 Demo（`src`）。

- `lib` 负责：分词引擎、语言注册、语言规则、主题映射。
- `src` 负责：可视化展示和交互，不是核心引擎。

## 1.1 项目内 Skill（`.agent`）【重要】

本项目存在**本地技能系统**：`.agent/skills`。  
后续任何 Agent 接手时，应把它视为本仓库的优先上下文，而不是只依赖通用默认行为。

- 技能索引：`.agent/skills/agent.md`
- 工作流建议：`brainstorming -> writing-plans -> implementation`
- 核心技能：
  - `brainstorming`：设计探索与需求澄清（先设计，后实现）
  - `writing-plans`：把规格拆成可执行计划
  - `belos-street`：个人代码规范与测试理念
  - `bun`：Bun 运行时/工具链约定（强调 Bun 优先）

补充说明：

- 当前技能文件名同时存在 `SKILL.md` 与 `skill.md`（大小写混用），读取时按实际文件路径处理。
- 如果任务与 `.agent/skills` 约定冲突，优先遵守项目内技能约定。

## 2. 当前能力（截至当前代码）

### 已支持语言

- `javascript`（较完整，测试覆盖高）
- `json`（首版可用）
- `python`（已支持三引号、f-string、装饰器、类型注解、comprehension、`as` 别名等实用语法）

### 已支持主题

- `dark-plus`（默认）
- `github-light`

### 已支持的公共能力

- 通用状态机分词引擎（行列追踪、状态栈、fallback）
- 语言 registry（按 id/alias 注册和查询）
- 主题 registry（按 id 查找，支持 scope 前缀回退）
- Token 流渲染 HTML（用于 demo 展示）

## 3. 核心设计原则

1. **引擎和语言解耦**
   - 引擎在 `lib/core`，语言规则在 `lib/language/<lang>/rule.ts`。
2. **语言和主题解耦**
   - 语言定义 scope，主题定义 scope 对应样式。
3. **核心库与 demo 解耦**
   - `lib` 是可复用核心，`src` 仅是调试展示层。
4. **先稳态再扩展**
   - 新语言优先复用 `core` + `registry`，先跑通测试，再扩展复杂语法。

## 4. 执行链路（从输入代码到高亮）

```text
source code
  -> language manager (lib/language/manager.ts)
  -> core registry (lib/core/registry.ts)
  -> language adapter.parse()
  -> core tokenizer.parse(spec)
  -> TokenStream
  -> renderHtml (src/render.ts, demo 使用)
  -> theme resolver (lib/themes/index.ts)
  -> HTML
```

## 5. 目录地图（重点）

```text
lib/
  core/
    types.ts         # Token/Rule/Context/Spec 等通用类型
    tokenizer.ts     # 通用状态机引擎
    registry.ts      # 语言注册中心（LanguageAdapter）

  language/
    manager.ts       # 高层语言调度（自动注册 builtins）
    builtins.ts      # 内置语言列表
    index.ts         # 语言入口导出

    javascript/
      type.ts
      rule.ts
      spec.ts
      engine.ts
      index.ts
      __test__/

    json/
      type.ts
      rule.ts
      spec.ts
      engine.ts
      index.ts
      __test__/

    python/
      type.ts
      rule.ts
      spec.ts
      engine.ts
      index.ts
      __test__/

  themes/
    types.ts
    dark-plus.ts
    github-light.ts
    index.ts         # 主题注册、查询、scope 回退
    __test__/

src/
  render.ts          # TokenStream -> HTML（展示层）
  demo/
    app.ts           # Playground 交互（主题 tab + 语言 tab）
    languages.ts     # demo snippet/标签配置
    types.ts
  main.ts            # demo 入口（挂载）
  styles.css

bench/
  common.ts
  bench-js-language.ts
  bench-python-language.ts
```

## 6. 关键模块说明

### 6.1 `lib/core/tokenizer.ts`

通用引擎，核心函数：

- `createInitialContext(initialState)`
- `pushState / popState / getCurrentState`
- `matchToken(code, context, spec)`
- `splitTokenByLineBreak(...)`
- `parse(code, spec)`

行为要点：

- 按状态读规则列表，第一条匹配即命中。
- 无规则命中时走 `fallbackScope` 单字符兜底。
- 维护 `line/col`，支持 `\n` 和 `\r\n`。

### 6.2 `lib/core/registry.ts`

定义语言适配器接口：

```ts
interface LanguageAdapter {
  id: string
  aliases?: string[]
  parse: (code: string) => TokenStream
}
```

能力：

- `registerLanguage(language)`
- `getLanguage(languageId)`
- `listLanguages()`
- `tokenize(code, languageId)`

### 6.3 `lib/language/manager.ts`

在 `registry` 外包一层语言管理：

- 确保 builtins 只注册一次
- 暴露统一 API 给外部调用
- 提供 `resetLanguageRegistryForTest()` 供测试隔离

### 6.4 `lib/themes/index.ts`

主题层职责：

- 注册/查询主题：`registerTheme/getTheme/listThemes`
- 解析 scope 样式：`resolveScopeStyle(scope, theme)`
  - 精确命中
  - 前缀回退（`a.b.c -> a.b -> a`）
  - `defaultStyle` 兜底

## 7. 语言包约定（必须遵循）

每个语言目录建议包含：

- `type.ts`：本语言 `TokenScope`、`GrammarState`
- `rule.ts`：规则表 `GRAMMAR_RULES`
- `spec.ts`：`<LANG>_TOKENIZER_SPEC`
- `engine.ts`：对 `core/tokenizer` 的薄封装
- `index.ts`：导出 `{ <lang>Language, parse }`
- `__test__/`：最小 parser/integration 测试

## 8. 新增语言标准流程

1. 新建 `lib/language/<lang>/` 五件套（type/rule/spec/engine/index）。
2. 在 `lib/language/builtins.ts` 注册 `<lang>Language`。
3. 在 `lib/language/index.ts` 补导出。
4. 在 `lib/themes/*.ts` 添加该语言常用 scope 的样式（至少 default + 核心 token）。
5. 新增该语言测试（至少验证结构 token、基本值类型、边界输入）。
6. 如果需要 demo 预览，在 `src/demo/languages.ts` 加 snippet。

## 9. 新增主题标准流程

1. 新建 `lib/themes/<theme-id>.ts`，导出 `HighlightTheme`。
2. 在 `lib/themes/index.ts` 注册新主题。
3. 如果引入新 scope，请确保该主题有映射或可回退。
4. 在 `lib/themes/__test__/theme.test.ts` 补测试。

## 10. Demo 层约束

- `src` 仅用于浏览器调试展示，不应反向侵入 `lib` 的核心设计。
- 推荐把业务逻辑放在 `lib`，`src` 仅调用 `tokenize + renderHtml`。
- 当前 demo 有两个 tab：
  - `TabPane - 主题`
  - `TabPane - 语言`

## 11. 测试与验证

常用命令：

```bash
bun test
bunx tsc --noEmit
bun run bench:js-language
bun run bench:python-language
bun run verify:build
```

说明：

- 项目使用 Bun 测试。
- `vite` 依赖较新的 Node 版本；如果本地 Node 过旧，`vite build` 可能失败，但不影响 `lib` 测试。

## 12. 已知边界与后续建议

### 已知边界

- JSON 当前是首版 tokenizer，不含 JSON5 特性（注释、单引号、尾逗号等）。
- Python 当前是“实用增强版”，尚未覆盖全部复杂语法细节（例如超复杂模板/宏式写法）。
- `src/render.ts` 目前仍有 `highlightJavaScript` 便捷函数，通用场景建议走 `tokenize + renderHtml`。
- 主题映射仍是以具体 scope 为主，后续可升级为 “语义 token 层” 进一步去语言耦合。

### 建议优先级

1. 抽象 semantic token（`scope -> semantic -> style`）。
2. 新增 `typescript` / `html` / `css` / `bash` 等高频语言。
3. 补 README（当前 README 仍是 Bun 初始化模板，和真实项目结构不一致）。

## 13. 给大模型的快速工作策略

当你要修改此项目时，请优先遵守：

1. 不要把语言特定逻辑写进 `lib/core/*`。
2. 不要把主题定义写回语言目录。
3. 修改 `lib/language/*` 后必须跑 `bun test`。
4. 修改 `src/*` 时不应破坏 `lib` 的 API 稳定性。
5. 如果是“新增语言”，按第 8 节 checklist 一步一步做。

---

如果你是第一次接手这个项目，推荐阅读顺序：

1. `.agent/skills/agent.md`
1. `lib/core/tokenizer.ts`
2. `lib/core/registry.ts`
3. `lib/language/manager.ts`
4. `lib/language/javascript/*`
5. `lib/language/json/*`
6. `lib/language/python/*`
7. `lib/themes/index.ts`
8. `src/demo/app.ts`
