import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

/**
 * YAML token scope
 */
export type TokenScope =
  | 'comment.line.number-sign.yaml'
  | 'keyword.control.document.begin.yaml'
  | 'keyword.control.document.end.yaml'
  | 'support.type.property-name.yaml'
  | 'punctuation.separator.key-value.yaml'
  | 'punctuation.definition.sequence.item.yaml'
  | 'punctuation.section.flow.yaml'
  | 'string.quoted.double.yaml'
  | 'string.quoted.single.yaml'
  | 'string.unquoted.yaml'
  | 'constant.numeric.yaml'
  | 'constant.language.boolean.yaml'
  | 'constant.language.null.yaml'
  | 'entity.name.tag.anchor.yaml'
  | 'variable.other.alias.yaml'
  | 'entity.name.tag.yaml'
  | 'default'

/**
 * YAML grammar states
 */
export type GrammarState = 'global' | 'string-double' | 'string-single'

export type Token = CoreToken<TokenScope>
export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>
export type ParserContext = CoreParserContext<GrammarState>
export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>
export type TokenStream = CoreTokenStream<TokenScope>
