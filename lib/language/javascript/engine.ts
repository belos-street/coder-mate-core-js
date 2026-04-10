import {
  createInitialContext as createInitialContextCore,
  getCurrentState as getCurrentStateCore,
  matchToken as matchTokenCore,
  parse as parseCore,
  popState as popStateCore,
  pushState as pushStateCore,
  splitTokenByLineBreak as splitTokenByLineBreakCore
} from 'lib/core/tokenizer'
import { JAVASCRIPT_TOKENIZER_SPEC } from './spec'
import type {
  GrammarState,
  ParserContext,
  Token,
  TokenScope,
  TokenStream
} from './type'

/**
 * 创建初始解析上下文
 */
export const createInitialContext = (): ParserContext =>
  createInitialContextCore(JAVASCRIPT_TOKENIZER_SPEC.initialState)

/**
 * 压栈
 */
export const pushState = (
  context: ParserContext,
  state: GrammarState
): ParserContext => pushStateCore(context, state)

/**
 * 弹栈
 */
export const popState = (context: ParserContext): ParserContext =>
  popStateCore(context)

/**
 * 获取当前状态
 */
export const getCurrentState = (context: ParserContext): GrammarState =>
  getCurrentStateCore(context)

/**
 * 拆分包含换行符的 Token
 */
export const splitTokenByLineBreak = (
  text: string,
  scope: TokenScope,
  startLine: number,
  startCol: number
): Token[] =>
  splitTokenByLineBreakCore(
    text,
    scope,
    JAVASCRIPT_TOKENIZER_SPEC.fallbackScope,
    startLine,
    startCol
  )

/**
 * 匹配单个 token
 */
export const matchToken = (
  code: string,
  context: ParserContext
): { token: Token; newContext: ParserContext } | null =>
  matchTokenCore(code, context, JAVASCRIPT_TOKENIZER_SPEC)

/**
 * 解析代码为二维 Token 数组
 */
export const parse = (code: string): TokenStream =>
  parseCore(code, JAVASCRIPT_TOKENIZER_SPEC)
