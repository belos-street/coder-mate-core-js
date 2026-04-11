import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

/**
 * C++ token scope
 */
export type TokenScope =
  | 'comment.line.double-slash.cpp'
  | 'comment.block.cpp'
  | 'meta.preprocessor.cpp'
  | 'keyword.control.directive.cpp'
  | 'keyword.control.cpp'
  | 'keyword.declaration.cpp'
  | 'keyword.modifier.cpp'
  | 'support.type.builtin.cpp'
  | 'entity.name.type.cpp'
  | 'entity.name.function.cpp'
  | 'entity.name.namespace.cpp'
  | 'entity.name.macro.cpp'
  | 'constant.language.boolean.cpp'
  | 'constant.language.null.cpp'
  | 'constant.numeric.cpp'
  | 'string.quoted.angle.cpp'
  | 'string.quoted.double.cpp'
  | 'string.quoted.single.cpp'
  | 'string.quoted.raw.cpp'
  | 'operator.cpp'
  | 'default'

/**
 * C++ grammar states
 */
export type GrammarState =
  | 'global'
  | 'comment-block'
  | 'string-double'
  | 'string-single'
  | 'string-raw'
  | 'preprocessor-include'
  | 'preprocessor-define'
  | 'preprocessor-macro-ref'

export type Token = CoreToken<TokenScope>
export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>
export type ParserContext = CoreParserContext<GrammarState>
export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>
export type TokenStream = CoreTokenStream<TokenScope>
