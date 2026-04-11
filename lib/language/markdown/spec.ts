import type { TokenizerSpec } from '../../core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

/**
 * Markdown language metadata
 */
export const MARKDOWN_LANGUAGE_META = {
  id: 'markdown',
  aliases: ['md']
} as const

/**
 * Markdown tokenizer spec
 */
export const MARKDOWN_TOKENIZER_SPEC: TokenizerSpec<GrammarState, TokenScope> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
