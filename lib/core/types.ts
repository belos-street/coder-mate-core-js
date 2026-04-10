/**
 * 语言无关的核心类型定义
 */

/**
 * 单个词法单元
 */
export interface Token<Scope extends string = string> {
  text: string
  scope: Scope
  line: number
  col: [number, number]
}

/**
 * 状态机规则
 */
export interface GrammarRule<
  State extends string = string,
  Scope extends string = string
> {
  regex: RegExp
  scope: Scope
  pushState?: State
  popState?: boolean
  skip?: boolean
}

/**
 * 解析上下文
 */
export interface ParserContext<State extends string = string> {
  stateStack: State[]
  line: number
  col: number
}

/**
 * 状态到规则的映射
 */
export type GrammarRulesMap<
  State extends string = string,
  Scope extends string = string
> = Record<State, GrammarRule<State, Scope>[]>

/**
 * 按行组织的 token 流
 */
export type TokenStream<Scope extends string = string> = Token<Scope>[][]

/**
 * scope 到 CSS 样式映射
 */
export type ScopeStyleMap<Scope extends string = string> = Record<Scope, string>

/**
 * 通用词法规范
 */
export interface TokenizerSpec<
  State extends string = string,
  Scope extends string = string
> {
  initialState: State
  rules: GrammarRulesMap<State, Scope>
  fallbackScope: Scope
}
