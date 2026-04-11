import type { TokenizerSpec } from '../../core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

/**
 * CSS language metadata
 */
export const CSS_LANGUAGE_META = {
  id: 'css',
  aliases: []
} as const

/**
 * CSS tokenizer spec
 */
export const CSS_TOKENIZER_SPEC: TokenizerSpec<GrammarState, TokenScope> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
