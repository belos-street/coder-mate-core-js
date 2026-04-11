import type { GrammarRulesMap } from './type'

const HTML_ENTITY = /^&(?:[a-zA-Z][a-zA-Z0-9]+|#[0-9]+|#x[0-9A-Fa-f]+);/

/**
 * HTML grammar rules (practical edition)
 */
export const GRAMMAR_RULES: GrammarRulesMap = {
  global: [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^<!--/,
      scope: 'comment.block.html',
      pushState: 'comment'
    },
    {
      regex: /^<!DOCTYPE\b[^>]*>/i,
      scope: 'keyword.control.doctype.html'
    },
    {
      regex: /^<\//,
      scope: 'punctuation.definition.tag.begin.html',
      pushState: 'close-tag'
    },
    {
      regex: /^<[A-Za-z][A-Za-z0-9:-]*/,
      scope: 'entity.name.tag.html',
      pushState: 'open-tag'
    },
    {
      regex: /^</,
      scope: 'punctuation.definition.tag.begin.html',
      pushState: 'open-tag'
    },
    {
      regex: HTML_ENTITY,
      scope: 'constant.character.entity.html'
    },
    {
      regex: /^[^<&\r\n]+/,
      scope: 'text.plain.html'
    }
  ],

  comment: [
    {
      regex: /^[\s\S]*?-->/,
      scope: 'comment.block.html',
      popState: true
    },
    {
      regex: /^[\s\S]+/,
      scope: 'comment.block.html'
    }
  ],

  'open-tag': [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^\/>/,
      scope: 'punctuation.definition.tag.end.html',
      popState: true
    },
    {
      regex: /^>/,
      scope: 'punctuation.definition.tag.end.html',
      popState: true
    },
    {
      regex: /^[A-Za-z_:][A-Za-z0-9:._-]*/,
      scope: 'entity.other.attribute-name.html'
    },
    {
      regex: /^=/,
      scope: 'punctuation.separator.key-value.html',
      pushState: 'attribute-value'
    },
    {
      regex: HTML_ENTITY,
      scope: 'constant.character.entity.html'
    },
    {
      regex: /^./,
      scope: 'default'
    }
  ],

  'close-tag': [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^[A-Za-z][A-Za-z0-9:-]*/,
      scope: 'entity.name.tag.html'
    },
    {
      regex: /^>/,
      scope: 'punctuation.definition.tag.end.html',
      popState: true
    },
    {
      regex: /^./,
      scope: 'default',
      popState: true
    }
  ],

  'attribute-value': [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^"[^"\r\n]*"?/,
      scope: 'string.quoted.double.html',
      popState: true
    },
    {
      regex: /^'[^'\r\n]*'?/,
      scope: 'string.quoted.single.html',
      popState: true
    },
    {
      regex: /^(?:[^\s"'=<>`]+)/,
      scope: 'string.unquoted.html',
      popState: true
    },
    {
      regex: /^./,
      scope: 'default',
      popState: true
    }
  ]
}
