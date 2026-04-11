import type { TokenizerSpec } from '../../core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

/**
 * C# language metadata
 */
export const CSHARP_LANGUAGE_META = {
  id: 'csharp',
  aliases: ['cs', 'c#']
} as const

/**
 * C# tokenizer spec
 */
export const CSHARP_TOKENIZER_SPEC: TokenizerSpec<GrammarState, TokenScope> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
