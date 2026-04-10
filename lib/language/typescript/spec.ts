import type { TokenizerSpec } from '../../core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

export const TYPESCRIPT_LANGUAGE_META = {
  id: 'typescript',
  aliases: ['ts']
} as const

export const TYPESCRIPT_TOKENIZER_SPEC: TokenizerSpec<
  GrammarState,
  TokenScope
> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
