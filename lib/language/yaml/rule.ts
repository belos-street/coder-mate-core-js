import type { GrammarRulesMap } from './type'

/**
 * YAML grammar rules (practical edition)
 */
export const GRAMMAR_RULES: GrammarRulesMap = {
  global: [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^#.*/,
      scope: 'comment.line.number-sign.yaml'
    },
    {
      regex: /^---(?=\s|$)/,
      scope: 'keyword.control.document.begin.yaml'
    },
    {
      regex: /^\.\.\.(?=\s|$)/,
      scope: 'keyword.control.document.end.yaml'
    },
    {
      regex: /^"(?:[^"\\\r\n]|\\.)*"(?=\s*:)/,
      scope: 'support.type.property-name.yaml'
    },
    {
      regex: /^'(?:[^'\r\n]|'')*'(?=\s*:)/,
      scope: 'support.type.property-name.yaml'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_.-]*(?=\s*:)/,
      scope: 'support.type.property-name.yaml'
    },
    {
      regex: /^:/,
      scope: 'punctuation.separator.key-value.yaml'
    },
    {
      regex: /^-(?=\s|$)/,
      scope: 'punctuation.definition.sequence.item.yaml'
    },
    {
      regex: /^[\[\]\{\},]/,
      scope: 'punctuation.section.flow.yaml'
    },
    {
      regex: /^&[A-Za-z0-9_-]+/,
      scope: 'entity.name.tag.anchor.yaml'
    },
    {
      regex: /^\*[A-Za-z0-9_-]+/,
      scope: 'variable.other.alias.yaml'
    },
    {
      regex: /^![A-Za-z0-9!:/._-]+/,
      scope: 'entity.name.tag.yaml'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.yaml',
      pushState: 'string-double'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.yaml',
      pushState: 'string-single'
    },
    {
      regex: /^(?:true|false|yes|no|on|off)\b/i,
      scope: 'constant.language.boolean.yaml'
    },
    {
      regex: /^(?:null|~)\b/i,
      scope: 'constant.language.null.yaml'
    },
    {
      regex: /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/,
      scope: 'constant.numeric.yaml'
    },
    {
      regex: /^(?:[^\s\[\]\{\},#][^#\r\n]*)/,
      scope: 'string.unquoted.yaml'
    }
  ],

  'string-double': [
    {
      regex: /^[^"\\\n]+/,
      scope: 'string.quoted.double.yaml'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.double.yaml'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.yaml',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.double.yaml'
    }
  ],

  'string-single': [
    {
      regex: /^[^'\n]+/,
      scope: 'string.quoted.single.yaml'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.yaml',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.single.yaml'
    }
  ]
}
