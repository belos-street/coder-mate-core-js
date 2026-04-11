import type { TokenizerSpec } from '../../core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

/**
 * PHP language metadata
 */
export const PHP_LANGUAGE_META = {
  id: 'php',
  aliases: ['phtml', 'php8']
} as const

/**
 * PHP tokenizer spec
 */
export const PHP_TOKENIZER_SPEC: TokenizerSpec<GrammarState, TokenScope> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
