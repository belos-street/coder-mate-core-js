import type { TokenizerSpec } from '../../core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

/**
 * Java language metadata
 */
export const JAVA_LANGUAGE_META = {
  id: 'java',
  aliases: ['jav']
} as const

/**
 * Java tokenizer spec
 */
export const JAVA_TOKENIZER_SPEC: TokenizerSpec<GrammarState, TokenScope> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
