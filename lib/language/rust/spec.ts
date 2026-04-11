import type { TokenizerSpec } from '../../core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

/**
 * Rust language metadata
 */
export const RUST_LANGUAGE_META = {
  id: 'rust',
  aliases: ['rs']
} as const

/**
 * Rust tokenizer spec
 */
export const RUST_TOKENIZER_SPEC: TokenizerSpec<GrammarState, TokenScope> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
