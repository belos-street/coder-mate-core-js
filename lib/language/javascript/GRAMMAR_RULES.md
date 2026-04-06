# JavaScript 词法分析器 - GrammarRules 详解

本文档详细介绍 `rule.ts` 中 `grammarRules` 的每一个规则的作用和工作原理。

---

## 1. 核心概念

### 1.1 GrammarRule 结构

```typescript
interface GrammarRule {
  regex: RegExp      // 匹配正则表达式（使用 sticky y 标志）
  token: TokenType | null  // 生成的 token 类型，null 表示不生成 token
  state: GrammarState       // 匹配后切换到的状态
}
```

### 1.2 状态机概述

```
┌─────────────┐
│   Initial   │ ←── 主状态，处理大多数 JavaScript 语法
└──────┬──────┘
       │
       ├──────────────────┐
       │                  │
       ▼                  ▼
┌──────────────┐   ┌─────────────────────┐
│   Template   │   │ TemplateExpression  │
│ (模板字符串) │   │  (${} 内部表达式)   │
└──────────────┘   └─────────────────────┘
       ▲                  │
       └──────────────────┘
```

---

## 2. Initial 状态规则详解

`Initial` 是默认状态，处理绝大多数 JavaScript 语法。

### 2.1 注释规则

```typescript
{ regex: /(\/\/.*)/y, token: TokenType.Comment, state: GrammarState.Initial }
```

**作用**：匹配单行注释

**原理**：
- `\/\/` 匹配 `//`
- `.*` 匹配任意字符（换行符除外）
- Sticky 模式确保从当前位置开始匹配

**示例**：
```javascript
// 这是注释
let x = 1; // 行尾注释
```

---

### 2.2 字符串规则

```typescript
{ regex: /(".*?"|'.*?')/y, token: TokenType.String, state: GrammarState.Initial }
```

**作用**：匹配双引号和单引号字符串

**原理**：
- `".*?"` 非贪婪匹配双引号字符串
- `'.*?'` 非贪婪匹配单引号字符串
- 非贪婪模式确保匹配最短的可能字符串

**示例**：
```javascript
"hello"
'world'
"nested \"quotes\""
```

---

### 2.3 模板字符串开始

```typescript
{ regex: /(`)/y, token: null, state: GrammarState.Template }
```

**作用**：检测模板字符串的开始反引号

**原理**：
- 匹配单个反引号 `` ` ``
- `token: null` 表示不生成 token，只切换状态
- 切换到 `Template` 状态处理模板字符串内容

**示例**：
```javascript
`hello world`
```

---

### 2.4 关键字规则

关键字按功能分组，提高可维护性。

#### 2.4.1 控制流关键字

```typescript
{
  regex: /(break|continue|switch|case|default|try|catch|finally|throw|new|delete|void|typeof|in|instanceof)\b/y,
  token: TokenType.Keyword,
  state: GrammarState.Initial
}
```

**关键字**：`break`, `continue`, `switch`, `case`, `default`, `try`, `catch`, `finally`, `throw`, `new`, `delete`, `void`, `typeof`, `in`, `instanceof`

**原理**：
- `\b` 单词边界确保不会匹配部分单词（如 `breakat`）
- 使用捕获组 `(...)` 提取匹配的关键字

---

#### 2.4.2 函数和异步关键字

```typescript
{ regex: /(async|await|yield|function)\b/y, token: TokenType.Keyword, state: GrammarState.Initial }
```

**关键字**：`async`, `await`, `yield`, `function`

---

#### 2.4.3 类相关关键字

```typescript
{ regex: /(class|extends|super|static|get|set|constructor)\b/y, token: TokenType.Keyword, state: GrammarState.Initial }
```

**关键字**：`class`, `extends`, `super`, `static`, `get`, `set`, `constructor`

---

#### 2.4.4 模块关键字

```typescript
{ regex: /(import|export|from|as)\b/y, token: TokenType.Keyword, state: GrammarState.Initial }
```

**关键字**：`import`, `export`, `from`, `as`

---

#### 2.4.5 声明和流程关键字

```typescript
{ regex: /(let|const|var|return|if|else|for|while|of)\b/y, token: TokenType.Keyword, state: GrammarState.Initial }
```

**关键字**：`let`, `const`, `var`, `return`, `if`, `else`, `for`, `while`, `of`

---

### 2.5 运算符规则

运算符按长度降序排列，确保最长匹配。

#### 2.5.1 三字符运算符

```typescript
{ regex: /(>>>=)/y, token: TokenType.Operator, state: GrammarState.Initial }
```

**运算符**：`>>>=`（带符号右移赋值）

**原理**：必须放在两字符运算符前面，避免被拆分

---

#### 2.5.2 两字符运算符

```typescript
{
  regex: /(>>>=|===|!==|&&=|\|\|=|\?\?=|\*\*|<<=|>>=|>>>|\+\+|--|==|!=|<=|>=|&&|\|\||\?\?|\?\.|<<|>>|=>|\.\.\.|\+=|-=|\*=|\/=|%=|&=|\|=|\^=)/y,
  token: TokenType.Operator,
  state: GrammarState.Initial
}
```

**包含的运算符**：

| 分类 | 运算符 |
|------|--------|
| 移位赋值 | `>>>=`, `<<=`, `>>=` |
| 比较 | `===`, `!==`, `==`, `!=`, `<=`, `>=` |
| 逻辑 | `&&`, `\|\|`, `??`, `?.` |
| 递增/递减 | `++`, `--` |
| 指数 | `**` |
| 箭头函数 | `=>` |
| 展开 | `...` |
| 赋值 | `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `\|=`, `^=` |
| 移位 | `>>>`, `<<`, `>>` |

---

### 2.6 共享表达式规则 (createExpressionRules)

```typescript
function createExpressionRules(targetState: GrammarState): GrammarRule[] {
  return [
    // 字面量
    { regex: /\b(true|false|null|undefined|this)\b/y, token: TokenType.Literal, state: targetState },
    // 数字
    { regex: /0[bB][01](?:_?[01])*n?|0[oO][0-7](?:_?[0-7])*n?|0[xX][0-9a-fA-F](?:_?[0-9a-fA-F])*n?|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?n?|\d+(?:_\d+)*n/y, token: TokenType.Number, state: targetState },
    // 标识符
    { regex: /([a-zA-Z_$][a-zA-Z0-9_$]*)/y, token: TokenType.Identifier, state: targetState },
    // 字符串
    { regex: /(".*?"|'.*?')/y, token: TokenType.String, state: targetState },
    // 两字符运算符
    { regex: /(===|!==|&&|\|\||\?\?|\?\.|==|!=|<=|>=|<<|>>|\+\+|--|\*\*|=>|\.\.\.)/y, token: TokenType.Operator, state: targetState },
    // 单字符运算符
    { regex: /([+\-*\/%=<>!&|^~?:@])/y, token: TokenType.Operator, state: targetState },
    // 标点符号
    { regex: /([;,.(){}[\]])/y, token: TokenType.Punctuation, state: targetState },
    // 空白字符
    { regex: /([ \t]+)/y, token: TokenType.Whitespace, state: targetState },
    // 换行符
    { regex: /(\n)/y, token: TokenType.Newline, state: targetState }
  ]
}
```

这些规则在 `Initial` 和 `TemplateExpression` 状态中共享。

#### 2.6.1 字面量 (Literal)

```typescript
{ regex: /\b(true|false|null|undefined|this)\b/y, token: TokenType.Literal, state: targetState }
```

**字面量值**：`true`, `false`, `null`, `undefined`, `this`

---

#### 2.6.2 数字 (Number)

```typescript
{
  regex: /0[bB][01](?:_?[01])*n?|0[oO][0-7](?:_?[0-7])*n?|0[xX][0-9a-fA-F](?:_?[0-9a-fA-F])*n?|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?n?|\d+(?:_\d+)*n/y,
  token: TokenType.Number,
  state: targetState
}
```

**支持的数字格式**：

| 格式 | 正则部分 | 示例 |
|------|----------|------|
| 二进制 | `0[bB][01](?:_?[01])*n?` | `0b1010`, `0b1010_0101n` |
| 八进制 | `0[oO][0-7](?:_?[0-7])*n?` | `0o755`, `0o755n` |
| 十六进制 | `0[xX][0-9a-fA-F](?:_?[0-9a-fA-F])*n?` | `0xFF`, `0xDEAD_BEEFn` |
| 十进制整数 | `\d+(?:_\d+)*n?` | `123`, `1_000_000n` |
| 十进制浮点数 | `\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?n?` | `3.14`, `1.5e-3` |

**ES2020 特性**：
- 数字分隔符：`1_000_000`
- BigInt 后缀：`123n`

---

#### 2.6.3 标识符 (Identifier)

```typescript
{ regex: /([a-zA-Z_$][a-zA-Z0-9_$]*)/y, token: TokenType.Identifier, state: targetState }
```

**规则**：
- 首字符：`[a-zA-Z_$]`
- 后续字符：`[a-zA-Z0-9_$]*`

**示例**：`foo`, `_bar`, `$baz`, `camelCase`, `PascalCase`

---

#### 2.6.4 标点符号 (Punctuation)

```typescript
{ regex: /([;,.(){}[\]])/y, token: TokenType.Punctuation, state: targetState }
```

**符号**：`,` (逗号), `;` (分号), `(` `)` (括号), `{` `}` (大括号), `[` `]` (方括号)

---

#### 2.6.5 空白字符 (Whitespace)

```typescript
{ regex: /([ \t]+)/y, token: TokenType.Whitespace, state: targetState }
```

**匹配的空白**：
- 空格 ` `
- Tab `\t`

**不匹配**：换行符（由单独的 Newline 规则处理）

---

#### 2.6.6 换行符 (Newline)

```typescript
{ regex: /(\n)/y, token: TokenType.Newline, state: targetState }
```

**作用**：
- 匹配 `\n`
- 触发行号递增
- 创建新的一行 token 数组

---

## 3. Template 状态规则详解

`Template` 状态处理模板字符串的静态内容部分。

### 3.1 进入表达式

```typescript
{ regex: /(\$\{)/y, token: null, state: GrammarState.TemplateExpression }
```

**作用**：检测 `${` 序列

**原理**：
- `\$\{` 转义匹配 `${`
- `token: null` 不生成 token
- 切换到 `TemplateExpression` 状态

**示例**：
```javascript
`Hello ${name}`
         ^^^^ 触发切换
```

---

### 3.2 模板字符串内容

```typescript
{ regex: /([^`$\\]+|\\.)+/y, token: TokenType.TemplateString, state: GrammarState.Template }
```

**作用**：匹配模板字符串的静态文本

**原理**：
- `[^`$\\]+` 匹配除反引号、`$`、反斜杠以外的字符
- `\\.` 匹配转义序列（如 `\n`, `\t`, `\$`）
- `+` 确保至少匹配一个字符

**示例**：
```javascript
`Hello ${name}!`
     ^^^^^^^^^^^ 匹配 "Hello " 和 "!" 两个 token
```

---

### 3.3 模板字符串结束

```typescript
{ regex: /(`)/y, token: null, state: GrammarState.Initial }
```

**作用**：检测结束的反引号

**原理**：
- 匹配 `` ` ``
- `token: null` 不生成 token
- 切换回 `Initial` 状态

---

## 4. TemplateExpression 状态规则详解

`TemplateExpression` 状态处理 `${}` 内部的 JavaScript 表达式。

### 4.1 嵌套表达式

```typescript
{ regex: /(\$\{)/y, token: null, state: GrammarState.TemplateExpression }
```

**作用**：支持嵌套的模板表达式

**示例**：
```javascript
`${a${b}}`  // 合法的嵌套
```

---

### 4.2 结束表达式

```typescript
{ regex: /(\})/y, token: null, state: GrammarState.Template }
```

**作用**：检测 `}` 结束模板表达式

**原理**：
- 匹配 `}`
- `token: null` 不生成 token
- 切换回 `Template` 状态

---

### 4.3 内嵌模板字符串

```typescript
{ regex: /(`)/y, token: TokenType.TemplateString, state: GrammarState.Template }
```

**作用**：支持模板字符串内嵌套另一个模板字符串

**示例**：
```javascript
`outer ${`inner`} end`
```

---

### 4.4 表达式内容

```typescript
...createExpressionRules(GrammarState.TemplateExpression)
```

**作用**：复用 `Initial` 状态的表达式规则

**包含**：字面量、数字、标识符、字符串、运算符、标点符号、空白、换行

---

## 5. 状态转换图

```
                    ┌─────────────────────────────────────────────┐
                    │                                             │
                    ▼                                             │
┌─────────────┐  `` ` ``  ┌──────────────┐  ${  ┌─────────────────────┐
│   Initial   │ ─────────► │   Template   │ ────► │ TemplateExpression │
└─────────────┘           └──────────────┘       └─────────────────────┘
     ▲                            │                         │
     │                            │                         │
     │                     `` ` ``                          │
     │◄──────────────────────────────────────────────────────┘
     │                            │   }                      │
     └────────────────────────────┘◄──────────────────────────┘
```

---

## 6. 完整 tokenization 示例

### 示例 1: `const msg = "Hello";`

```
Token序列:
1. token-keyword: "const"
2. token-identifier: "msg"
3. token-operator: "="
4. token-string: "\"Hello\""
5. token-punctuation: ";"
```

### 示例 2: `` `Hello ${name}!` ``

```
解析过程:
1. `` ` `` → Template状态（无token）
2. "Hello " → token-template-string
3. "${" → TemplateExpression状态（无token）
4. "name" → token-identifier
5. "}" → Template状态（无token）
6. "!" → token-template-string
7. "`" → Initial状态（无token）

结果: ["Hello ", name, "!"] 的token数组
```

### 示例 3: `for (let i = 0; i < 10; i++)`

```
Token序列:
1. token-keyword: "for"
2. token-punctuation: "("
3. token-keyword: "let"
4. token-identifier: "i"
5. token-operator: "="
6. token-number: "0"
7. token-punctuation: ";"
8. token-identifier: "i"
9. token-operator: "<"
10. token-number: "10"
11. token-punctuation: ";"
12. token-identifier: "i"
13. token-operator: "++"
14. token-punctuation: ")"
```

---

## 7. 规则匹配顺序

词法分析器按以下顺序应用规则：

1. **按状态分组**：当前状态对应的规则数组
2. **按定义顺序**：规则数组中的顺序
3. **最长匹配**：哪个规则匹配最长字符就用哪个
4. **Sticky 模式**：`y` 标志确保从确切位置开始匹配

**重要**：运算符规则必须按长度降序排列（三字符 → 两字符 → 单字符），避免短匹配优先于长匹配。

---

## 8. 附录：Token 类型对照表

| TokenType | 描述 | 示例 |
|-----------|------|------|
| `token-comment` | 注释 | `// comment`, `/* block */` |
| `token-string` | 字符串 | `"hello"`, `'world'` |
| `token-template-string` | 模板字符串内容 | `` `hello ${name}` `` 中的 `hello ` |
| `token-keyword` | 关键字 | `const`, `if`, `function` |
| `token-literal` | 字面量 | `true`, `null`, `this` |
| `token-number` | 数字 | `42`, `3.14`, `0xFF`, `123n` |
| `token-identifier` | 标识符 | `foo`, `myVar` |
| `token-operator` | 运算符 | `+`, `===`, `++` |
| `token-punctuation` | 标点符号 | `,`, `;`, `()` |
| `token-whitespace` | 空白字符 | 空格, Tab |
| `token-newline` | 换行符 | `\n` |
| `token-regex` | 正则表达式 | `/pattern/g` (未来支持) |
