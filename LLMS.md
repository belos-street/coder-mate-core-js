# LLMS.md

> 目标：让任何大模型在最短时间内理解 `coder-mate-core-js` 的定位、结构、约束与扩展方式，并且能安全地继续开发。

## 1. 项目一句话

这是一个 **可扩展的多语言语法高亮核心库**（`lib`），配套一个用于预览和调试的浏览器 Demo（`src`）。

- `lib`：分词引擎、语言注册、主题系统、对外 API。
- `src`：Demo 展示层，不是核心引擎。

## 2. 当前对外 API（以当前代码为准）

### 2.1 根导出（`lib/index.ts`）

仅暴露两个同步函数：

- `codeToTokens(code, { lang })`
- `codeToHtml(code, { lang, theme?, preStyle?, lineClassPrefix? })`

说明：

- 这是项目推荐的主入口。
- 当前 API **是同步**的；上层如需异步，可自行封装 Promise。

### 2.2 子路径导出（`package.json`）

- `coder-mate-core-js` -> 根 API（上面两个函数）
- `coder-mate-core-js/language` -> 语言注册与各语言 parser 导出
- `coder-mate-core-js/themes` -> 主题注册、查询、主题对象导出

## 3. 当前能力快照

### 3.1 内置语言（17）

内置语言来自 `lib/language/builtins.ts`：

- `javascript`
- `typescript`
- `css`
- `bash`
- `sql`
- `yaml`
- `markdown`
- `java`
- `c`
- `cpp`
- `csharp`
- `go`
- `rust`
- `php`
- `html`
- `json`
- `python`

### 3.2 内置主题（10）

- `dark-plus`（默认）
- `github-light`
- `dracula`
- `one-dark-pro`
- `nord`
- `monokai`
- `material-ocean`
- `tokyo-night`
- `solarized-dark`
- `solarized-light`

### 3.3 主题设计现状

- `dark-plus` 是基准主题（`lib/themes/dark-plus/`）。
- 其他主题（包括 `github-light`）通过 `lib/themes/presets.ts` + `lib/themes/theme-variant.ts` 基于调色板生成。
- 主题 registry 支持 scope 前缀回退（`a.b.c -> a.b -> a -> default`）。

## 4. 架构原则（必须遵守）

1. **核心与语言解耦**
   - `lib/core/*` 只放通用状态机能力，不写语言特定逻辑。
2. **语言与主题解耦**
   - 语言产出 scope；主题负责 scope -> style 映射。
3. **库与 Demo 解耦**
   - `src/*` 不反向侵入 `lib/*` 设计。
4. **先稳定再扩展**
   - 新语言/新主题先打通测试，再补复杂语法与细节。

## 5. 关键执行链路

### 5.1 `codeToTokens`

`code` -> `lib/api.ts` -> `lib/language/manager.ts` -> `lib/core/registry.ts` -> 对应语言 `parse` -> `TokenStream`

### 5.2 `codeToHtml`

`codeToTokens` -> `resolveTheme` -> `resolveScopeStyle` -> HTML 转义 -> `<pre><code>...` 输出

## 6. 目录地图（重点）

```text
lib/
  api.ts                  # 根 API：codeToTokens / codeToHtml
  index.ts                # 根导出

  core/
    types.ts              # Token / Rule / Context / Spec 等通用类型
    tokenizer.ts          # 通用状态机 tokenizer
    registry.ts           # 语言注册中心

  language/
    builtins.ts           # 内置语言集合
    manager.ts            # 语言层调度 + 内置语言自动注册
    index.ts              # 语言子路径导出
    <lang>/               # 各语言目录（type/rule/spec/engine/index/__test__）

  themes/
    dark-plus/            # 基准主题（按语言拆分）
    presets.ts            # 主题预设（含 github-light 与额外 8 个主题）
    theme-variant.ts      # 主题变体生成器（按调色板替换）
    index.ts              # 主题 registry 与导出
    types.ts
    __test__/

src/
  demo/
    app.ts                # Playground（语言 tab + 主题 tab）
    languages.ts
    types.ts
  render.ts               # Demo 层渲染工具（兼容性保留）
  main.ts
  styles.css

bench/
  bench-js-language.ts
  bench-typescript-language.ts
  bench-python-language.ts
  common.ts
```

## 7. 语言扩展约定

每个语言目录建议包含：

- `type.ts`
- `rule.ts`
- `spec.ts`
- `engine.ts`
- `index.ts`
- `__test__/`

接入步骤：

1. 新建 `lib/language/<lang>/` 五件套。
2. 在 `lib/language/builtins.ts` 注册 `<lang>Language`。
3. 在 `lib/language/index.ts` 导出 parser 与 language 对象。
4. 为关键语法写测试（正常 + 边界容错）。
5. 需要 Demo 预览时，补 `src/demo/languages.ts` snippet。

## 8. 主题扩展约定

### 8.1 推荐路径（新增常见主题）

在 `lib/themes/presets.ts` 增加一个 `VariantDefinition`：

- `id`
- `displayName`
- `background` / `border` / `fontFamily`（可选）
- `palette`（12 色映射）

然后导出并加入 `presetBuiltInThemes`。

### 8.2 新增“基准主题”场景

仅当确实需要不同于 `dark-plus` 的 scope 基线时，再新建类似 `lib/themes/dark-plus/` 的完整主题目录。

## 9. Demo 现状

- 主题 tab 已支持 10 个主题切换。
- 语言 tab 会根据 `codeToTokens('', { lang })` 动态判断可用性。
- Demo 文案已切到 `codeToTokens + codeToHtml`。

## 10. 测试与命令

常用命令：

```bash
bun test
bunx tsc --noEmit -p tsconfig.build.json
bun run bench:js-language
bun run bench:typescript-language
bun run bench:python-language
bun run verify:build
```

说明：

- 测试使用 Bun。
- `verify:build` 会走构建和导入检查。

## 11. 已知边界与注意事项

- `src/render.ts` 仍保留 `highlightJavaScript`（偏 demo/兼容用途），新功能优先走根 API。
- 高亮本质是 tokenizer + scope 映射，不是 AST 级语义分析。
- 复杂语法优先保证“不崩溃 + 合理降级”，再逐步精细化 scope。

## 12. 给接手模型的工作策略

1. 先看 `lib/index.ts`、`lib/api.ts`，确认对外接口。
2. 再看 `lib/language/manager.ts` 和 `lib/language/builtins.ts`。
3. 再看 `lib/themes/index.ts`、`lib/themes/presets.ts`、`lib/themes/theme-variant.ts`。
4. 做任何改动后优先跑 `bun test` 与 `bunx tsc --noEmit -p tsconfig.build.json`。
5. 不要把语言特定逻辑写进 `lib/core/*`。

## 13. 项目内 Skill（.agents）

仓库包含本地技能系统（`.agents/skills`）。接手任务时可优先参考：

- `.agents/skills/agent.md`
- `brainstorming`
- `writing-plans`
- `belos-street`
- `bun`

若通用习惯与项目内 skill 冲突，以项目内约定为准。
