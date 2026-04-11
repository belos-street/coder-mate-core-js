import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

/**
 * Rust token scope
 */
export type TokenScope =
  | 'comment.line.double-slash.rust'
  | 'comment.block.rust'
  | 'meta.attribute.rust'
  | 'keyword.control.rust'
  | 'keyword.declaration.rust'
  | 'keyword.modifier.rust'
  | 'support.type.builtin.rust'
  | 'entity.name.type.rust'
  | 'entity.name.function.rust'
  | 'entity.name.namespace.rust'
  | 'entity.name.macro.rust'
  | 'variable.language.rust'
  | 'constant.language.boolean.rust'
  | 'constant.language.null.rust'
  | 'constant.numeric.rust'
  | 'string.quoted.double.rust'
  | 'string.quoted.single.rust'
  | 'string.quoted.raw.rust'
  | 'operator.rust'
  | 'default'

/**
 * Rust grammar states
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
