import type { TokenizerSpec } from '../../core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

/**
 * Bash language metadata
 */
export const BASH_LANGUAGE_META = {
  id: 'bash',
  aliases: ['sh', 'shell']
} as const

/**
 * Bash tokenizer spec
 */
export const BASH_TOKENIZER_SPEC: TokenizerSpec<GrammarState, TokenScope> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
