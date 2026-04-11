import type { GrammarRulesMap } from './type'

/**
 * Markdown grammar rules (practical edition)
 */
export const GRAMMAR_RULES: GrammarRulesMap = {
  global: [
    {
      regex: /^(?: {4}|\t)[^\r\n]*/,
      scope: 'markup.code.indented.markdown'
    },
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^<!--/,
      scope: 'comment.block.markdown',
      pushState: 'comment-block'
    },
    {
      regex: /^(?: {0,3})(?:```|~~~)[^\r\n]*/,
      scope: 'markup.fenced-code.block.begin.markdown',
      pushState: 'fenced-code'
    },
    {
      regex: /^(?: {0,3})#{1,6}\s+[^\r\n]*/,
      scope: 'markup.heading.markdown'
    },
    {
      regex: /^(?: {0,3})(?:=+|-{2,})\s*(?=\r?\n|$)/,
      scope: 'markup.heading.setext.markdown'
    },
    {
      regex: /^(?: {0,3})(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})(?=\r?\n|$)/,
      scope: 'markup.hr.markdown'
    },
    {
      regex: /^(?: {0,3})>\s?/,
      scope: 'markup.quote.markdown'
    },
    {
      regex: /^(?: {0,3})(?:[-+*]|\d+[.)])\s+\[(?: |x|X)\]\s+/,
      scope: 'markup.task.markdown'
    },
    {
      regex: /^(?: {0,3})(?:[-+*]|\d+[.)])\s+/,
      scope: 'markup.list.markdown'
    },
    {
      regex: /^(?: {0,3})\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*(?=\r?\n|$)/,
      scope: 'markup.table.separator.markdown'
    },
    {
      regex: /^(?: {0,3})\|[^\r\n]*\|(?=\r?\n|$)/,
      scope: 'markup.table.row.markdown'
    },
    {
      regex: /^\[[^\]\r\n]+\]:/,
      scope: 'markup.reference.link.label.markdown'
    },
    {
      regex: /^(?:\s*<https?:\/\/[^>\s]+>|\s*https?:\/\/[^\s]+)(?=\s*(?:"[^"\r\n]*"|'[^'\r\n]*')?\s*(?:\r?\n|$))/,
      scope: 'markup.reference.link.url.markdown'
    },
    {
      regex: /^!\[[^\]\r\n]*\]/,
      scope: 'markup.image.label.markdown'
    },
    {
      regex: /^\[[^\]\r\n]*\](?!:)/,
      scope: 'markup.link.label.markdown'
    },
    {
      regex: /^\((?:[^()\r\n]|\\.)*\)/,
      scope: 'markup.link.url.markdown'
    },
    {
      regex: /^[\[\]\(\)!]/,
      scope: 'markup.link.punctuation.markdown'
    },
    {
      regex: /^`/,
      scope: 'markup.inline.raw.markdown',
      pushState: 'inline-code'
    },
    {
      regex: /^~~/,
      scope: 'markup.strikethrough.markdown',
      pushState: 'strikethrough'
    },
    {
      regex: /^(?:\*\*|__)/,
      scope: 'markup.bold.markdown',
      pushState: 'strong'
    },
    {
      regex: /^(?:\*|_)/,
      scope: 'markup.italic.markdown',
      pushState: 'emphasis'
    },
    {
      regex: /^(?:<https?:\/\/[^>\s]+>|https?:\/\/[^\s)\]]+)/,
      scope: 'markup.link.url.markdown'
    },
    {
      regex: /^[^\s`*_~#[\]()!<>|]+/,
      scope: 'string.unquoted.markdown'
    },
    {
      regex: /^./,
      scope: 'string.unquoted.markdown'
    }
  ],

  'comment-block': [
    {
      regex: /^[\s\S]*?-->/,
      scope: 'comment.block.markdown',
      popState: true
    },
    {
      regex: /^[\s\S]+/,
      scope: 'comment.block.markdown'
    }
  ],

  'fenced-code': [
    {
      regex: /^(?: {0,3})(?:```|~~~)\s*(?=\r?\n|$)/,
      scope: 'markup.fenced-code.block.end.markdown',
      popState: true
    },
    {
      regex: /^[^\r\n]+/,
      scope: 'string.unquoted.markdown'
    },
    {
      regex: /^./,
      scope: 'string.unquoted.markdown'
    }
  ],

  'inline-code': [
    {
      regex: /^`/,
      scope: 'markup.inline.raw.markdown',
      popState: true
    },
    {
      regex: /^[^`\r\n]+/,
      scope: 'markup.inline.raw.markdown'
    },
    {
      regex: /^./,
      scope: 'markup.inline.raw.markdown'
    }
  ],

  strong: [
    {
      regex: /^(?:\*\*|__)/,
      scope: 'markup.bold.markdown',
      popState: true
    },
    {
      regex: /^[^\r\n]+?(?=(?:\*\*|__)|$)/,
      scope: 'markup.bold.markdown'
    },
    {
      regex: /^./,
      scope: 'markup.bold.markdown'
    }
  ],

  emphasis: [
    {
      regex: /^(?:\*|_)/,
      scope: 'markup.italic.markdown',
      popState: true
    },
    {
      regex: /^[^\r\n]+?(?=(?:\*|_)|$)/,
      scope: 'markup.italic.markdown'
    },
    {
      regex: /^./,
      scope: 'markup.italic.markdown'
    }
  ],

  strikethrough: [
    {
      regex: /^~~/,
      scope: 'markup.strikethrough.markdown',
      popState: true
    },
    {
      regex: /^[^\r\n~]+/,
      scope: 'markup.strikethrough.markdown'
    },
    {
      regex: /^./,
      scope: 'markup.strikethrough.markdown'
    }
  ]
}
