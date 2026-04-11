import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

/**
 * CSS token scope
 */
export type TokenScope =
  | 'comment.block.css'
  | 'keyword.control.at-rule.css'
  | 'keyword.other.important.css'
  | 'support.type.property-name.css'
  | 'variable.parameter.custom-property.css'
  | 'support.function.css'
  | 'constant.other.color.hex.css'
  | 'constant.numeric.css'
  | 'string.quoted.double.css'
  | 'string.quoted.single.css'
  | 'entity.name.tag.css'
  | 'entity.other.attribute-name.class.css'
  | 'entity.other.attribute-name.id.css'
  | 'entity.other.attribute-name.pseudo-class.css'
  | 'entity.other.attribute-name.pseudo-element.css'
  | 'punctuation.section.block.begin.css'
  | 'punctuation.section.block.end.css'
  | 'punctuation.separator.key-value.css'
  | 'punctuation.separator.selector.css'
  | 'punctuation.terminator.rule.css'
  | 'punctuation.definition.attribute.begin.css'
  | 'punctuation.definition.attribute.end.css'
  | 'operator.css'
  | 'default'

/**
 * CSS grammar states
 */
export type GrammarState =
  | 'global'
  | 'block'
  | 'comment'
  | 'string-double'
  | 'string-single'

export type Token = CoreToken<TokenScope>
export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>
export type ParserContext = CoreParserContext<GrammarState>
export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>
export type TokenStream = CoreTokenStream<TokenScope>
