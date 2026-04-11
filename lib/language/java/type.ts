import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

/**
 * Java token scope
 */
export type TokenScope =
  | 'comment.line.double-slash.java'
  | 'comment.block.java'
  | 'keyword.control.java'
  | 'keyword.declaration.java'
  | 'keyword.modifier.java'
  | 'support.type.builtin.java'
  | 'entity.name.type.java'
  | 'entity.name.function.java'
  | 'entity.name.namespace.java'
  | 'meta.annotation.java'
  | 'variable.language.java'
  | 'constant.language.boolean.java'
  | 'constant.language.null.java'
  | 'constant.numeric.java'
  | 'string.quoted.double.java'
  | 'string.quoted.single.java'
  | 'string.quoted.triple.java'
  | 'operator.java'
  | 'default'

/**
 * Java grammar states
 */
export type GrammarState =
  | 'global'
  | 'comment-block'
  | 'string-double'
  | 'string-single'
  | 'string-text-block'

export type Token = CoreToken<TokenScope>
export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>
export type ParserContext = CoreParserContext<GrammarState>
export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>
export type TokenStream = CoreTokenStream<TokenScope>
