import type { TokenizerSpec } from '../../core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

/**
 * YAML language metadata
 */
export const YAML_LANGUAGE_META = {
  id: 'yaml',
  aliases: ['yml']
} as const

/**
 * YAML tokenizer spec
 */
export const YAML_TOKENIZER_SPEC: TokenizerSpec<GrammarState, TokenScope> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
