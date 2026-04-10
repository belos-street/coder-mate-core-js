import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  ScopeStyleMap as CoreScopeStyleMap,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

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

export type Token = CoreToken<TokenScope>

// ==================== Grammar Rule 接口 ====================

export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>

// ==================== Parser Context 接口 ====================

export type ParserContext = CoreParserContext<GrammarState>

// ==================== 类型映射 ====================

/**
 * Scope 到 CSS 样式的映射表
 */
export type ScopeStyleMap = CoreScopeStyleMap<TokenScope>

/**
 * 状态到规则列表的映射表
 */
export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>

// ==================== Token 流类型 ====================

/**
 * Token 流 - 按行组织的 Token 序列
 */
export type TokenStream = CoreTokenStream<TokenScope>
