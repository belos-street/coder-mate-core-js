import type { TokenizerSpec } from '../../core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

/**
 * Python language metadata
 */
export const PYTHON_LANGUAGE_META = {
  id: 'python',
  aliases: ['py']
} as const

/**
 * Python tokenizer spec
 */
export const PYTHON_TOKENIZER_SPEC: TokenizerSpec<GrammarState, TokenScope> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
