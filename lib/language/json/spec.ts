import type { TokenizerSpec } from '../../core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

/**
 * JSON language metadata
 */
export const JSON_LANGUAGE_META = {
  id: 'json',
  aliases: []
} as const

/**
 * JSON tokenizer spec
 */
export const JSON_TOKENIZER_SPEC: TokenizerSpec<GrammarState, TokenScope> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
