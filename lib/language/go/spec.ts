import type { TokenizerSpec } from '../../core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

/**
 * Go language metadata
 */
export const GO_LANGUAGE_META = {
  id: 'go',
  aliases: ['golang']
} as const

/**
 * Go tokenizer spec
 */
export const GO_TOKENIZER_SPEC: TokenizerSpec<GrammarState, TokenScope> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
