import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

/**
 * JSON token scope
 */
export type TokenScope =
  | 'string.quoted.double.json'
  | 'constant.numeric.json'
  | 'constant.language.boolean.json'
  | 'constant.language.null.json'
  | 'punctuation.separator.key-value.json'
  | 'punctuation.separator.value.json'
  | 'meta.structure.dictionary.json'
  | 'meta.structure.array.json'
  | 'default'

/**
 * JSON grammar states
 */
export type GrammarState = 'global' | 'string-double'

export type Token = CoreToken<TokenScope>
export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>
export type ParserContext = CoreParserContext<GrammarState>
export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>
export type TokenStream = CoreTokenStream<TokenScope>
