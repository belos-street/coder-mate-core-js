import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  ScopeStyleMap as CoreScopeStyleMap,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'
import type {
  GrammarState as JavaScriptGrammarState,
  TokenScope as JavaScriptTokenScope
} from '../javascript/type'

export type TokenScope =
  | JavaScriptTokenScope
  | 'keyword.declaration.type.typescript'
  | 'keyword.modifier.access.typescript'
  | 'keyword.operator.assertion.typescript'
  | 'keyword.operator.type.typescript'
  | 'support.type.builtin.typescript'
  | 'entity.name.type.typescript'

export type GrammarState =
  | JavaScriptGrammarState
  | 'expect-type-name'
  | 'class-after-name'
  | 'class-type-parameter'

export type Token = CoreToken<TokenScope>

export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>

export type ParserContext = CoreParserContext<GrammarState>

export type ScopeStyleMap = CoreScopeStyleMap<TokenScope>

export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>

export type TokenStream = CoreTokenStream<TokenScope>
