import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

/**
 * C# token scope
 */
export type TokenScope =
  | 'comment.line.double-slash.csharp'
  | 'comment.block.csharp'
  | 'meta.preprocessor.csharp'
  | 'meta.attribute.csharp'
  | 'keyword.control.csharp'
  | 'keyword.declaration.csharp'
  | 'keyword.modifier.csharp'
  | 'support.type.builtin.csharp'
  | 'entity.name.type.csharp'
  | 'entity.name.function.csharp'
  | 'entity.name.namespace.csharp'
  | 'variable.language.csharp'
  | 'constant.language.boolean.csharp'
  | 'constant.language.null.csharp'
  | 'constant.numeric.csharp'
  | 'string.quoted.double.csharp'
  | 'string.quoted.single.csharp'
  | 'string.quoted.verbatim.csharp'
  | 'string.quoted.raw.csharp'
  | 'operator.csharp'
  | 'default'

/**
 * C# grammar states
 */
export type GrammarState =
  | 'global'
  | 'comment-block'
  | 'string-double'
  | 'string-single'
  | 'string-verbatim'
  | 'string-raw'

export type Token = CoreToken<TokenScope>
export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>
export type ParserContext = CoreParserContext<GrammarState>
export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>
export type TokenStream = CoreTokenStream<TokenScope>
