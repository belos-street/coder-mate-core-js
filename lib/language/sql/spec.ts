import type { TokenizerSpec } from '../../core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

/**
 * SQL language metadata
 */
export const SQL_LANGUAGE_META = {
  id: 'sql',
  aliases: ['postgresql', 'pgsql']
} as const

/**
 * SQL tokenizer spec
 */
export const SQL_TOKENIZER_SPEC: TokenizerSpec<GrammarState, TokenScope> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
