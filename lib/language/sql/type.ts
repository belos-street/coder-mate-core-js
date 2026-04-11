import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

/**
 * SQL token scope
 */
export type TokenScope =
  | 'comment.line.double-dash.sql'
  | 'comment.block.sql'
  | 'keyword.control.sql'
  | 'keyword.operator.sql'
  | 'support.function.builtin.sql'
  | 'constant.language.boolean.sql'
  | 'constant.language.null.sql'
  | 'constant.numeric.sql'
  | 'string.quoted.single.sql'
  | 'string.quoted.double.sql'
  | 'variable.parameter.sql'
  | 'entity.name.table.sql'
  | 'entity.name.column.sql'
  | 'punctuation.separator.comma.sql'
  | 'punctuation.terminator.statement.sql'
  | 'punctuation.section.group.begin.sql'
  | 'punctuation.section.group.end.sql'
  | 'default'

/**
 * SQL grammar states
 */
export type GrammarState =
  | 'global'
  | 'expect-table-name'
  | 'string-single'
  | 'string-double'
  | 'comment-block'

export type Token = CoreToken<TokenScope>
export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>
export type ParserContext = CoreParserContext<GrammarState>
export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>
export type TokenStream = CoreTokenStream<TokenScope>
