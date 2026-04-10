import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

/**
 * Python token scope
 */
export type TokenScope =
  | 'comment.line.number-sign.python'
  | 'keyword.control.python'
  | 'keyword.declaration.python'
  | 'entity.name.function.python'
  | 'entity.name.class.python'
  | 'support.function.builtin.python'
  | 'support.type.annotation.python'
  | 'meta.decorator.python'
  | 'constant.language.boolean.python'
  | 'constant.language.none.python'
  | 'constant.numeric.python'
  | 'string.quoted.single.python'
  | 'string.quoted.double.python'
  | 'string.quoted.single.triple.python'
  | 'string.quoted.double.triple.python'
  | 'string.interpolated.python'
  | 'punctuation.definition.interpolation.begin.python'
  | 'punctuation.definition.interpolation.end.python'
  | 'punctuation.format.fstring.python'
  | 'operator.python'
  | 'variable.alias.python'
  | 'variable.comprehension.python'
  | 'variable.identifier.python'
  | 'default'

/**
 * Python grammar states
 */
export type GrammarState =
  | 'global'
  | 'expect-function-name'
  | 'expect-class-name'
  | 'string-single'
  | 'string-double'
  | 'string-triple-single'
  | 'string-triple-double'
  | 'f-string-single'
  | 'f-string-double'
  | 'f-string-triple-single'
  | 'f-string-triple-double'
  | 'f-string-interpolation'
  | 'expect-as-alias'
  | 'expect-comprehension-target'

export type Token = CoreToken<TokenScope>
export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>
export type ParserContext = CoreParserContext<GrammarState>
export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>
export type TokenStream = CoreTokenStream<TokenScope>
