import type { TokenizerSpec } from 'lib/core/types'
import { GRAMMAR_RULES } from './rule'
import type { GrammarState, TokenScope } from './type'

/**
 * JavaScript 语言元数据
 */
export const JAVASCRIPT_LANGUAGE_META = {
  id: 'javascript',
  aliases: ['js']
} as const

/**
 * JavaScript 分词规范
 */
export const JAVASCRIPT_TOKENIZER_SPEC: TokenizerSpec<
  GrammarState,
  TokenScope
> = {
  initialState: 'global',
  rules: GRAMMAR_RULES,
  fallbackScope: 'default'
}
