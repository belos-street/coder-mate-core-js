import type { TokenizerSpec } from '../../core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

/**
 * C++ language metadata
 */
export const CPP_LANGUAGE_META = {
  id: 'cpp',
  aliases: ['c++', 'cc', 'cxx', 'hpp', 'hxx', 'hh']
} as const

/**
 * C++ tokenizer spec
 */
export const CPP_TOKENIZER_SPEC: TokenizerSpec<GrammarState, TokenScope> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
