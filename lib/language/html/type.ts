import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

/**
 * HTML token scope
 */
export type TokenScope =
  | 'comment.block.html'
  | 'keyword.control.doctype.html'
  | 'punctuation.definition.tag.begin.html'
  | 'punctuation.definition.tag.end.html'
  | 'entity.name.tag.html'
  | 'entity.other.attribute-name.html'
  | 'punctuation.separator.key-value.html'
  | 'string.quoted.double.html'
  | 'string.quoted.single.html'
  | 'string.unquoted.html'
  | 'constant.character.entity.html'
  | 'text.plain.html'
  | 'default'

/**
 * HTML grammar states
 */
export type GrammarState =
  | 'global'
  | 'comment'
  | 'open-tag'
  | 'close-tag'
  | 'attribute-value'

export type Token = CoreToken<TokenScope>
export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>
export type ParserContext = CoreParserContext<GrammarState>
export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>
export type TokenStream = CoreTokenStream<TokenScope>
