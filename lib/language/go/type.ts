import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

/**
 * Go token scope
 */
export type TokenScope =
  | 'comment.line.double-slash.go'
  | 'comment.block.go'
  | 'keyword.control.go'
  | 'keyword.declaration.go'
  | 'support.type.builtin.go'
  | 'entity.name.function.go'
  | 'entity.name.type.go'
  | 'entity.name.namespace.go'
  | 'constant.language.boolean.go'
  | 'constant.language.null.go'
  | 'constant.language.iota.go'
  | 'constant.numeric.go'
  | 'string.quoted.double.go'
  | 'string.quoted.single.go'
  | 'string.quoted.raw.go'
  | 'operator.go'
  | 'default'

/**
 * Go grammar states
 */
export type GrammarState =
  | 'global'
  | 'comment-block'
  | 'string-double'
  | 'string-single'
  | 'string-raw'

export type Token = CoreToken<TokenScope>
export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>
export type ParserContext = CoreParserContext<GrammarState>
export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>
export type TokenStream = CoreTokenStream<TokenScope>
