import type { TokenizerSpec } from '../../core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

/**
 * HTML language metadata
 */
export const HTML_LANGUAGE_META = {
  id: 'html',
  aliases: ['htm']
} as const

/**
 * HTML tokenizer spec
 */
export const HTML_TOKENIZER_SPEC: TokenizerSpec<GrammarState, TokenScope> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
