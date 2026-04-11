import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

/**
 * Markdown token scope
 */
export type TokenScope =
  | 'markup.heading.markdown'
  | 'markup.heading.setext.markdown'
  | 'markup.hr.markdown'
  | 'markup.quote.markdown'
  | 'markup.list.markdown'
  | 'markup.task.markdown'
  | 'markup.table.separator.markdown'
  | 'markup.table.row.markdown'
  | 'markup.bold.markdown'
  | 'markup.italic.markdown'
  | 'markup.strikethrough.markdown'
  | 'markup.inline.raw.markdown'
  | 'markup.code.indented.markdown'
  | 'markup.fenced-code.block.begin.markdown'
  | 'markup.fenced-code.block.end.markdown'
  | 'markup.link.label.markdown'
  | 'markup.link.url.markdown'
  | 'markup.link.punctuation.markdown'
  | 'markup.image.label.markdown'
  | 'markup.reference.link.label.markdown'
  | 'markup.reference.link.url.markdown'
  | 'comment.block.markdown'
  | 'string.unquoted.markdown'
  | 'default'

/**
 * Markdown grammar states
 */
export type GrammarState =
  | 'global'
  | 'inline-code'
  | 'fenced-code'
  | 'comment-block'
  | 'strong'
  | 'emphasis'
  | 'strikethrough'

export type Token = CoreToken<TokenScope>
export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>
export type ParserContext = CoreParserContext<GrammarState>
export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>
export type TokenStream = CoreTokenStream<TokenScope>
