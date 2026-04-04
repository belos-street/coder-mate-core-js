# JavaScript 词法分析器完善计划

## 项目定位

- **目标**：构建类似Shiki的JavaScript词法分析引擎，用于语法高亮
- **范围**：仅支持JavaScript ES2020词法分析
- **复杂度**：中等，重点在词法规则完善和状态机增强

---

## 当前状态

### ✅ 已完成
- 基础词法框架
- 基础关键字（let, const, var, function, return, if, else, for, while）
- 字符串识别（单引号、双引号）
- 注释识别（仅单行 //）
- 行号和列号追踪
- 二维数组组织tokens

### ❌ 缺失的ES2020特性

#### 高优先级
- [ ] 所有ES2020关键字（async, await, class, extends, import, export等）
- [ ] 数字字面量增强（二进制0b、八进制0o、十六进制0x、BigInt 123n）
- [ ] 组合运算符（===, !==, ??, ?., ??=, &&=, ||=, =>, ...等）
- [ ] 模板字符串 `` `...${...}...` ``
- [ ] 多行注释 /* ... */

#### 中优先级
- [ ] 完善单元测试覆盖所有ES2020词法
- [ ] 性能优化
- [ ] 完善HTML演示页面

#### 可选
- [ ] 正则表达式字面量 /
- [ ] 标签语句（label:）

---

## 具体任务清单

### 阶段一：完善词法规则

#### 1. 完善ES2020关键字
**文件**: rule.ts

新增关键字分类：
```typescript
// 控制流
break, continue, switch, case, default, try, catch, finally, 
throw, new, delete, void, typeof, in, instanceof

// 函数和异步
async, await, yield

// 类相关
class, extends, super, static, get, set, constructor

// 模块
import, export, from, as, default

// 字面量
true, false, null, undefined, this, of

// 内置对象（可选）
console, Object, Array, String, Number, Boolean, Function, Symbol, Promise, Map, Set
```

Token类型：
- `token-keyword` - 关键字
- `token-literal` - 字面量（true/false/null/undefined）
- `token-builtin` - 内置对象

#### 2. 增强数字字面量
**文件**: rule.ts

需要支持：
```javascript
0b1010        // 二进制
0o755         // 八进制
0xFF          // 十六进制
1_000_000     // 数字分隔符（ES2021）
123n          // BigInt（ES2020）
1.5e-3        // 科学计数法
3.14159      // 小数
```

#### 3. 修复运算符识别
**文件**: rule.ts

当前问题：运算符被拆分成单个字符

需要识别为整体的运算符：
```javascript
===  !==  <=  >=  &&  ||  ??  ?.  ...  ??=  &&=  ||=
=>   ++   --   **  **=  <<  >>  >>>  &=  |=  ^=  %=
+=   -=   *=   /=  =   !=  !   ~   &   |   ^   <   >
```

Token类型：
- `token-operator` - 运算符
- `token-punctuation` - 标点符号（;,.:等）

---

### 阶段二：状态机增强

#### 4. 模板字符串支持 ⭐ 核心
**文件**: rule.ts, main.ts

ES2020语法：
```javascript
`Hello ${name}!`
`count: ${count + 1}`
`template with ${obj?.prop}`
`multi-line
template`
```

需要新增状态：
```typescript
states: {
  'initial': [...基础规则...],
  'template': [模板字符串内容...],
  'template_expr': [${}内表达式...],
}
```

Token类型：
- `token-template-string` - 模板字符串
- `token-template-expression` - `${}` 内的表达式

关键实现点：
- 识别开始符号 `` ` ``
- 识别结束符号 `` ` ``
- 识别 `${` 进入表达式状态
- 识别 `}` 退出表达式状态
- 处理嵌套的 `}` 情况

#### 5. 多行注释支持
**文件**: rule.ts, main.ts

ES2020语法：
```javascript
/*
 * 多行注释
 * 支持跨行
 */

/**
 * JSDoc注释
 */
```

需要新增状态：
```typescript
'comment_multiline': [/* ... */的内容...]
```

Token类型：
- `token-comment` - 注释（区分单行和多行）

关键实现点：
- 识别开始符号 `/*`
- 识别结束符号 `*/`
- 处理跨行
- 可选：处理嵌套注释（但JS不支持嵌套）

---

### 阶段三：测试和优化

#### 6. 完善单元测试
**文件**: javascript.test.ts

需要测试覆盖：
- [ ] 所有ES2020关键字
- [ ] 数字字面量（所有进制、BigInt、科学计数法）
- [ ] 模板字符串（简单、表达式、跨行）
- [ ] 多行注释
- [ ] 组合运算符
- [ ] 边界情况（未闭合的字符串、注释等）

#### 7. 性能优化
**文件**: main.ts

考虑点：
- [ ] 正则表达式预编译
- [ ] 减少不必要的状态切换
- [ ] 优化token构建
- [ ] 避免字符串拼接

#### 8. 完善HTML演示
**文件**: test.html

功能：
- [ ] 支持输入ES2020代码
- [ ] 实时语法高亮
- [ ] 显示token序列
- [ ] 对比不同语法的识别效果

---

## 开发顺序建议

1. **先修复基础问题**
   - 运算符优先级
   - 关键字完整性
   - 数字字面量

2. **再增强状态机**
   - 模板字符串（核心难点）
   - 多行注释

3. **最后完善测试和演示**
   - 确保所有语法都能正确识别
   - 性能测试
   - 用户体验优化

---

## 参考资料

- [MDN JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- [ECMAScript 2020 Specification](https://tc39.es/ecma262/2020/)
- [Shiki Architecture](https://shiki.style/guide/architecture)

---

## 更新日志

### 2026-04-04
- 创建完善计划文档
- 确定项目范围：仅支持JavaScript ES2020词法分析
- 规划8个核心任务
