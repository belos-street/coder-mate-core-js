# coder-mate-core-js

一个面向工程落地的代码高亮解析器：**TextMate 风格作用域（scope）命名 + 有限状态机（FSM）+ 纯文本解析**。

它专注做两件事：

- 把源码解析成带 scope 的 `TokenStream`
- 把 `TokenStream` 渲染成可直接展示的 HTML

## 核心特性

- 纯文本解析，不依赖 AST，启动快、实现可控
- 借鉴 TextMate 作用域命名体系（如 `keyword.control.js`）
- 通用 FSM tokenizer 内核，语言实现可插拔
- 语言注册中心 + alias 解析（如 `ts -> typescript`）
- 主题注册中心，支持 scope 前缀回退
- 默认内置 17 种语言、10 套主题

## 设计原理

### 1. TextMate 风格作用域（Scope）

语言规则产出的不是“颜色”，而是语义作用域字符串，例如：

- `keyword.control.js`
- `string.quoted.double.python`
- `entity.name.type.typescript`

主题层再把 scope 映射到样式，实现语言和主题解耦。

### 2. 有限状态机（FSM）分词

`lib/core/tokenizer.ts` 是通用状态机引擎：

- 每个状态对应一组正则规则
- 命中规则可 `pushState` / `popState`
- 未命中时走 `fallbackScope` 保证可继续前进（不死循环）

这让多行注释、字符串、模板插值等语法都可以通过状态切换表达。

### 3. 纯文本语法作用域解析

解析基于文本和规则，不做 AST 构建。

优点：

- 实现简单，易扩展
- 性能稳定，适合实时高亮场景
- 对不完整代码更友好（可容错降级）

边界：

- 不是编译器级语义分析
- 极复杂语法优先“可解析 + 不崩溃”，再逐步细化 scope

## 脚本说明

首次拉取代码后先安装依赖：

```bash
bun install
```

下面是日常最常用的脚本（来自 `package.json`）：

| 脚本 | 用途 |
| --- | --- |
| `bun run dev` | 启动 Vite 本地开发环境（Demo 调试） |
| `bun run build` | 构建完整产物（`lib` + `src`） |
| `bun run verify:build` | 完整构建并验证构建产物可被导入 |
| `bun test` | 运行全部单元测试 |
| `bun run bench:js-language` | JavaScript 语言基准测试 |
| `bun run bench:typescript-language` | TypeScript 语言基准测试 |
| `bun run bench:python-language` | Python 语言基准测试 |
| `bun run serve` | 本地静态预览（构建产物/页面） |

补充脚本（构建拆分）：

| 脚本 | 用途 |
| --- | --- |
| `bun run build:lib` | 仅构建库产物（`dist`） |
| `bun run build:src` | 仅构建 `src` 侧产物（`dist-src`） |
| `bun run build:lib:esm` | 仅构建 lib 的 ESM 文件 |
| `bun run build:lib:types` | 仅生成类型声明文件 |
| `bun run test:build:import` | 检查 lib 构建产物导入 |
| `bun run test:build:src:import` | 检查 src 构建产物导入 |

## 快速开始

```ts
import { createHighlighter } from 'coder-mate-core-js'

const code = `const answer: number = 42`
const highlighter = createHighlighter({
  theme: 'github-light'
})

const tokens = await highlighter.codeToTokens(code, {
  lang: 'typescript'
})

const html = await highlighter.codeToHtml(code, {
  lang: 'typescript'
})

await highlighter.updateTheme('dark-plus')
```

### API

#### `createHighlighter(options?)`

- `options.theme?: string | HighlightTheme`
- `options.preStyle?: string`
- `options.lineClassPrefix?: string`

返回：`Highlighter` 实例（包含 `codeToTokens / codeToHtml / updateTheme`）

#### `highlighter.codeToTokens(code, options)`

- `code: string`
- `options.lang: string`（必填）

返回：`TokenStream`（每个 token 都包含 `style` 对象，如 `color`、`font-style`）

#### `highlighter.codeToHtml(code, options)`

- `code: string`
- `options.lang: string`（必填）
- `options.preStyle?: string`
- `options.lineClassPrefix?: string`

返回：HTML 字符串（`<pre><code>...</code></pre>`）

#### `highlighter.updateTheme(theme)`

- `theme: string | HighlightTheme`

更新当前 highlighter 主题。  
对于已经解析过并缓存的 `(code, lang)`，只会重新计算 token 的 `style`，不会重复分词。

主题别名：

- `dark` -> `dark-plus`
- `github` -> `github-light`

## 当前内置语言（17）

- javascript
- typescript
- css
- bash
- sql
- yaml
- markdown
- java
- c
- cpp
- csharp
- go
- rust
- php
- html
- json
- python

## 当前内置主题（10）

- dark-plus（默认）
- github-light
- dracula
- one-dark-pro
- nord
- monokai
- material-ocean
- tokyo-night
- solarized-dark
- solarized-light

## 目录结构

```text
lib/
  api.ts                  # 根 API：createHighlighter（实例含 codeToTokens/codeToHtml/updateTheme）
  index.ts                # 根导出

  core/
    types.ts              # 通用类型
    tokenizer.ts          # FSM 分词内核
    registry.ts           # 语言注册中心

  language/
    manager.ts            # 语言调度 + builtins 自动注册
    builtins.ts           # 内置语言列表
    index.ts              # language 子路径导出
    <lang>/               # 各语言实现（type/rule/spec/engine/index/__test__）

  themes/
    dark-plus/            # 基准主题（按语言拆分）
    theme-variant.ts      # 主题变体生成器
    presets.ts            # 主题预设（含 github-light + 8 个扩展主题）
    index.ts              # 主题注册/查询/回退
    __test__/

src/
  render.ts               # Demo 层渲染工具（兼容保留）
  demo/                   # Playground

bench/
  bench-js-language.ts
  bench-typescript-language.ts
  bench-python-language.ts
  common.ts
```

## 新增语言（建议流程）

1. 新建 `lib/language/<lang>/`：
   - `type.ts`
   - `rule.ts`
   - `spec.ts`
   - `engine.ts`
   - `index.ts`
   - `__test__/`
2. 在 `lib/language/builtins.ts` 注册 `<lang>Language`
3. 在 `lib/language/index.ts` 导出 parser/language
4. 补测试（正常场景 + 边界容错）
5. 如需 Demo 展示，补 `src/demo/languages.ts` 的 snippet

## 新增主题（建议流程）

### 常见主题（推荐）

在 `lib/themes/presets.ts` 增加 `VariantDefinition`：

- `id`
- `displayName`
- `background` / `border` / `fontFamily`（可选）
- `palette`（12 色映射）

然后加入 `presetBuiltInThemes` 注册即可。

### 新基准主题（少数场景）

仅当你需要完全不同的 scope 基线时，再新增类似 `lib/themes/dark-plus/` 的完整目录主题。

## 构建与测试

```bash
# 单元测试
bun test

# 类型检查
bunx tsc --noEmit -p tsconfig.build.json

# 构建（库 + src）
bun run build

# 构建产物导入验证
bun run verify:build
```

## 性能基准

项目内置了 3 组 benchmark：

```bash
bun run bench:js-language
bun run bench:typescript-language
bun run bench:python-language
```

### 最近一次实测结果（2026-04-11）

> 以下数据为当前开发机单次实测结果，用于趋势对比；不同 CPU/内存/运行负载下会有波动。

| 语言 | 测试用例 | 行数 | 解析时间(ms) | 高亮时间(ms) | 总时间(ms) | 吞吐量(行/秒) |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| JavaScript | 小文件 | 100 | 3.70 | 4.09 | 7.79 | 12,832 |
| JavaScript | 中等文件 | 1,000 | 28.44 | 33.40 | 61.84 | 16,170 |
| JavaScript | 大文件 | 10,000 | 167.90 | 295.29 | 463.19 | 21,589 |
| JavaScript | 超大文件 | 50,000 | 727.03 | 2,361.90 | 3,088.94 | 16,187 |
| TypeScript | 小文件 | 100 | 8.23 | 10.06 | 18.29 | 5,468 |
| TypeScript | 中等文件 | 1,000 | 49.35 | 68.30 | 117.65 | 8,500 |
| TypeScript | 大文件 | 10,000 | 277.03 | 629.91 | 906.94 | 11,026 |
| TypeScript | 超大文件 | 50,000 | 1,408.96 | 3,105.56 | 4,514.52 | 11,075 |
| Python | 小文件 | 120 | 3.72 | 4.64 | 8.36 | 14,348 |
| Python | 中等文件 | 1,200 | 14.45 | 27.03 | 41.48 | 28,927 |
| Python | 大文件 | 12,000 | 97.75 | 268.53 | 366.29 | 32,761 |
| Python | 超大文件 | 60,000 | 533.63 | 1,195.03 | 1,728.66 | 34,709 |

补充说明：

- 本次基准测试设备处理器：`Intel(R) Core(TM) Ultra 7 258V`。
- Python 基准生成器包含少量多行语句，因此实际统计行数是输入规模的约 `1.2x`（100 -> 120，50,000 -> 60,000）。
- 这些 benchmark 更适合做版本间回归对比，不建议作为跨项目绝对性能结论。

## 开发约束建议

- 不要把语言特定逻辑写入 `lib/core/*`
- 不要把主题逻辑写回语言实现
- 优先保证“不崩溃 + 可回退”，再优化细粒度 scope
- 改动语言/主题后，至少执行：

```bash
bun test
bunx tsc --noEmit -p tsconfig.build.json
```

## License

MIT
