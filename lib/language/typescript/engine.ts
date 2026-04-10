import {
  createInitialContext as createInitialContextCore,
  getCurrentState as getCurrentStateCore,
  matchToken as matchTokenCore,
  parse as parseCore,
  popState as popStateCore,
  pushState as pushStateCore,
  splitTokenByLineBreak as splitTokenByLineBreakCore
} from '../../core/tokenizer'
import { TYPESCRIPT_TOKENIZER_SPEC } from './spec'
import type {
  GrammarState,
  ParserContext,
  Token,
  TokenScope,
  TokenStream
} from './type'

export const createInitialContext = (): ParserContext =>
  createInitialContextCore(TYPESCRIPT_TOKENIZER_SPEC.initialState)

export const pushState = (
  context: ParserContext,
  state: GrammarState
): ParserContext => pushStateCore(context, state)

export const popState = (context: ParserContext): ParserContext =>
  popStateCore(context)

export const getCurrentState = (context: ParserContext): GrammarState =>
  getCurrentStateCore(context)

export const splitTokenByLineBreak = (
  text: string,
  scope: TokenScope,
  startLine: number,
  startCol: number
): Token[] =>
  splitTokenByLineBreakCore(
    text,
    scope,
    TYPESCRIPT_TOKENIZER_SPEC.fallbackScope,
    startLine,
    startCol
  )

export const matchToken = (
  code: string,
  context: ParserContext
): { token: Token; newContext: ParserContext } | null =>
  matchTokenCore(code, context, TYPESCRIPT_TOKENIZER_SPEC)

export const parse = (code: string): TokenStream =>
  parseCore(code, TYPESCRIPT_TOKENIZER_SPEC)
