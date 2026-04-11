import type { TokenizerSpec } from '../../core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

/**
 * C language metadata
 */
export const C_LANGUAGE_META = {
  id: 'c',
  aliases: ['h', 'c89', 'c99', 'c11']
} as const

/**
 * C tokenizer spec
 */
export const C_TOKENIZER_SPEC: TokenizerSpec<GrammarState, TokenScope> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
