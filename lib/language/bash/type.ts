import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

/**
 * Bash token scope
 */
export type TokenScope =
  | 'comment.line.number-sign.bash'
  | 'keyword.control.bash'
  | 'keyword.declaration.function.bash'
  | 'entity.name.function.bash'
  | 'entity.name.command.bash'
  | 'support.function.builtin.bash'
  | 'variable.parameter.bash'
  | 'variable.language.special.bash'
  | 'variable.other.readwrite.bash'
  | 'constant.numeric.bash'
  | 'string.quoted.double.bash'
  | 'string.quoted.single.bash'
  | 'operator.bash'
  | 'default'

/**
 * Bash grammar states
 */
export type GrammarState =
  | 'global'
  | 'expect-function-name'
  | 'string-double'
  | 'string-single'

export type Token = CoreToken<TokenScope>
export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>
export type ParserContext = CoreParserContext<GrammarState>
export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>
export type TokenStream = CoreTokenStream<TokenScope>
