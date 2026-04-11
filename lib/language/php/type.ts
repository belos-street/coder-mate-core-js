import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

/**
 * PHP token scope
 */
export type TokenScope =
  | 'comment.line.double-slash.php'
  | 'comment.line.number-sign.php'
  | 'comment.block.php'
  | 'meta.tag.php'
  | 'meta.attribute.php'
  | 'keyword.control.php'
  | 'keyword.declaration.php'
  | 'keyword.modifier.php'
  | 'support.type.builtin.php'
  | 'entity.name.type.php'
  | 'entity.name.function.php'
  | 'entity.name.namespace.php'
  | 'variable.language.php'
  | 'variable.other.php'
  | 'constant.language.boolean.php'
  | 'constant.language.null.php'
  | 'constant.language.php'
  | 'constant.numeric.php'
  | 'string.quoted.double.php'
  | 'string.quoted.single.php'
  | 'string.quoted.backtick.php'
  | 'operator.php'
  | 'default'

/**
 * PHP grammar states
 */
export type GrammarState =
  | 'global'
  | 'comment-block'
  | 'string-double'
  | 'string-single'
  | 'string-backtick'

export type Token = CoreToken<TokenScope>
export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>
export type ParserContext = CoreParserContext<GrammarState>
export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>
export type TokenStream = CoreTokenStream<TokenScope>
