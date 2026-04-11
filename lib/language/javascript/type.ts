/**
 * ES2020 语法高亮器 - 类型定义
 * 采用函数式编程风格，所有类型均为不可变设计
 */

// ==================== Token Scope 类型 ====================

/**
 * Token 作用域类型 - 使用字面量联合类型提供精确的类型检查
 * 参考 VS Code TextMate 语法作用域命名规范
 */
export type TokenScope =
  | 'comment.line.double-slash.js'
  | 'comment.block.js'
  | 'keyword.control.js'
  | 'keyword.control.async.js'
  | 'keyword.control.class.js'
  | 'keyword.control.module.js'
  | 'keyword.control.import.js'
  | 'keyword.declaration.js'
  | 'constant.language.boolean.js'
  | 'constant.language.null.js'
  | 'constant.language.js'
  | 'constant.numeric.js'
  | 'variable.language.global-this.js'
  | 'variable.identifier.js'
  | 'string.quoted.double.js'
  | 'string.quoted.single.js'
  | 'string.quoted.backtick.js'
  | 'operator.js'
  | 'operator.optional-chaining.js'
  | 'operator.nullish-coalescing.js'
  | 'operator.arrow-function.js'
  | 'punctuation.definition.template-expression.js'
  | 'support.function.promise.js'
  | 'default'

// ==================== Grammar State 类型 ====================

/**
 * 语法状态类型 - 有限状态机的所有可能状态
 */
export type GrammarState =
  | 'global'
  | 'multiline-comment'
  | 'string-double'
  | 'string-single'
  | 'string-backtick'
  | 'template-interpolation'
  | 'import-dynamic'

// ==================== Token 接口 ====================

/**
 * Token 结构 - 单个词法单元的完整信息
 */
export interface Token {
  /** Token 文本内容 */
  text: string
  /** Token 作用域（用于样式映射） */
  scope: TokenScope
  /** 行号（1-based） */
  line: number
  /** 列范围 [起始列, 结束列]（1-based，闭区间） */
  col: [number, number]
}

// ==================== Grammar Rule 接口 ====================

/**
 * 语法规则 - 单个正则匹配规则
 */
export interface GrammarRule {
  /** 匹配正则（必须使用 ^ 锚定开头） */
  regex: RegExp
  /** 匹配成功后的 Token 作用域 */
  scope: TokenScope
  /** 压栈：进入新状态（可选） */
  pushState?: GrammarState
  /** 弹栈：退出当前状态（可选） */
  popState?: boolean
  /** 是否跳过（不生成 Token，仅切换状态） */
  skip?: boolean
}

// ==================== Parser Context 接口 ====================

/**
 * 解析器上下文 - 维护解析过程中的状态
 * 性能考虑：使用可变对象减少 GC 压力
 */
export interface ParserContext {
  /** 状态栈（栈顶为当前状态） */
  stateStack: GrammarState[]
  /** 当前行号（1-based） */
  line: number
  /** 当前列号（1-based） */
  col: number
}

// ==================== 类型映射 ====================

/**
 * Scope 到 CSS 样式的映射表
 */
export type ScopeStyleMap = Record<TokenScope, string>

/**
 * 状态到规则列表的映射表
 */
export type GrammarRulesMap = Record<GrammarState, GrammarRule[]>

// ==================== Token 流类型 ====================

/**
 * Token 流 - 按行组织的 Token 序列
 */
export type TokenStream = Token[][]
