import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

/**
 * C token scope
 */
export type TokenScope =
  | 'comment.line.double-slash.c'
  | 'comment.block.c'
  | 'meta.preprocessor.c'
  | 'keyword.control.directive.c'
  | 'keyword.control.c'
  | 'keyword.declaration.c'
  | 'keyword.modifier.c'
  | 'support.type.builtin.c'
  | 'entity.name.type.c'
  | 'entity.name.function.c'
  | 'entity.name.macro.c'
  | 'constant.language.boolean.c'
  | 'constant.language.null.c'
  | 'constant.numeric.c'
  | 'string.quoted.angle.c'
  | 'string.quoted.double.c'
  | 'string.quoted.single.c'
  | 'operator.c'
  | 'default'

/**
 * C grammar states
 */
export type GrammarState =
  | 'global'
  | 'comment-block'
  | 'string-double'
  | 'string-single'

export type Token = CoreToken<TokenScope>
export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>
export type ParserContext = CoreParserContext<GrammarState>
export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>
export type TokenStream = CoreTokenStream<TokenScope>
