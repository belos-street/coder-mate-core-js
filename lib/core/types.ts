/**
 * Language-agnostic core types
 */

/**
 * CSS style object attached to each token
 */
export interface TokenStyle {
  [cssProperty: string]: string
}

/**
 * A single lexical token
 */
export interface Token<Scope extends string = string> {
  text: string
  scope: Scope
  line: number
  col: [number, number]
  style: TokenStyle
}

/**
 * FSM grammar rule
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
 * Parser context
 */
export interface ParserContext<State extends string = string> {
  stateStack: State[]
  line: number
  col: number
}

/**
 * State -> rules mapping
 */
export type GrammarRulesMap<
  State extends string = string,
  Scope extends string = string
> = Record<State, GrammarRule<State, Scope>[]>

/**
 * 2D token stream grouped by line
 */
export type TokenStream<Scope extends string = string> = Token<Scope>[][]

/**
 * scope -> CSS style text mapping
 */
export type ScopeStyleMap<Scope extends string = string> = Record<Scope, string>

/**
 * Tokenizer specification
 */
export interface TokenizerSpec<
  State extends string = string,
  Scope extends string = string
> {
  initialState: State
  rules: GrammarRulesMap<State, Scope>
  fallbackScope: Scope
}
