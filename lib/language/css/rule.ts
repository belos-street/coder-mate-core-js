import type { GrammarRulesMap } from './type'

const FUNCTION_NAME = /^(?:-?[A-Za-z_][A-Za-z0-9_-]*)\s*(?=\()/

/**
 * CSS grammar rules (practical edition)
 */
export const GRAMMAR_RULES: GrammarRulesMap = {
  global: [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^\/\*/,
      scope: 'comment.block.css',
      pushState: 'comment'
    },
    {
      regex: /^@[A-Za-z-]+\b/,
      scope: 'keyword.control.at-rule.css'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.css',
      pushState: 'string-double'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.css',
      pushState: 'string-single'
    },
    {
      regex: /^\.[A-Za-z_-][A-Za-z0-9_-]*/,
      scope: 'entity.other.attribute-name.class.css'
    },
    {
      regex: /^#[A-Za-z_-][A-Za-z0-9_-]*/,
      scope: 'entity.other.attribute-name.id.css'
    },
    {
      regex: /^::[A-Za-z-]+(?:\([^()\r\n]*\))?/,
      scope: 'entity.other.attribute-name.pseudo-element.css'
    },
    {
      regex: /^:[A-Za-z-]+(?:\([^()\r\n]*\))?/,
      scope: 'entity.other.attribute-name.pseudo-class.css'
    },
    {
      regex: /^\[/,
      scope: 'punctuation.definition.attribute.begin.css'
    },
    {
      regex: /^\]/,
      scope: 'punctuation.definition.attribute.end.css'
    },
    {
      regex: /^,/,
      scope: 'punctuation.separator.selector.css'
    },
    {
      regex: /^\{/,
      scope: 'punctuation.section.block.begin.css',
      pushState: 'block'
    },
    {
      regex: /^;/,
      scope: 'punctuation.terminator.rule.css'
    },
    {
      regex: /^:/,
      scope: 'punctuation.separator.key-value.css'
    },
    {
      regex: /^!important\b/i,
      scope: 'keyword.other.important.css'
    },
    {
      regex: /^#[0-9A-Fa-f]{3,8}\b/,
      scope: 'constant.other.color.hex.css'
    },
    {
      regex: /^-?(?:\d*\.\d+|\d+)(?:[A-Za-z%]+)?/,
      scope: 'constant.numeric.css'
    },
    {
      regex: FUNCTION_NAME,
      scope: 'support.function.css'
    },
    {
      regex: /^(?:>|\+|~|\|\||\||\/|\*|=)/,
      scope: 'operator.css'
    },
    {
      regex: /^(?:\*|[A-Za-z][A-Za-z0-9-]*)/,
      scope: 'entity.name.tag.css'
    }
  ],

  block: [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^\/\*/,
      scope: 'comment.block.css',
      pushState: 'comment'
    },
    {
      regex: /^\}/,
      scope: 'punctuation.section.block.end.css',
      popState: true
    },
    {
      regex: /^\{/,
      scope: 'punctuation.section.block.begin.css',
      pushState: 'block'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.css',
      pushState: 'string-double'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.css',
      pushState: 'string-single'
    },
    {
      regex: /^@[A-Za-z-]+\b/,
      scope: 'keyword.control.at-rule.css'
    },
    {
      regex: /^!important\b/i,
      scope: 'keyword.other.important.css'
    },
    {
      regex: /^--[A-Za-z_][A-Za-z0-9_-]*(?=\s*:)/,
      scope: 'variable.parameter.custom-property.css'
    },
    {
      regex: /^-?[A-Za-z_][A-Za-z0-9_-]*(?=\s*:)/,
      scope: 'support.type.property-name.css'
    },
    {
      regex: /^:/,
      scope: 'punctuation.separator.key-value.css'
    },
    {
      regex: /^;/,
      scope: 'punctuation.terminator.rule.css'
    },
    {
      regex: /^#[0-9A-Fa-f]{3,8}\b/,
      scope: 'constant.other.color.hex.css'
    },
    {
      regex: /^\.[A-Za-z_-][A-Za-z0-9_-]*/,
      scope: 'entity.other.attribute-name.class.css'
    },
    {
      regex: /^#[A-Za-z_-][A-Za-z0-9_-]*/,
      scope: 'entity.other.attribute-name.id.css'
    },
    {
      regex: /^::[A-Za-z-]+(?:\([^()\r\n]*\))?/,
      scope: 'entity.other.attribute-name.pseudo-element.css'
    },
    {
      regex: /^:[A-Za-z-]+(?:\([^()\r\n]*\))?/,
      scope: 'entity.other.attribute-name.pseudo-class.css'
    },
    {
      regex: /^\[/,
      scope: 'punctuation.definition.attribute.begin.css'
    },
    {
      regex: /^\]/,
      scope: 'punctuation.definition.attribute.end.css'
    },
    {
      regex: /^,/,
      scope: 'punctuation.separator.selector.css'
    },
    {
      regex: /^-?(?:\d*\.\d+|\d+)(?:[A-Za-z%]+)?/,
      scope: 'constant.numeric.css'
    },
    {
      regex: FUNCTION_NAME,
      scope: 'support.function.css'
    },
    {
      regex: /^(?:>|\+|~|\|\||\||\/|\*|=|-)/,
      scope: 'operator.css'
    }
  ],

  comment: [
    {
      regex: /^[\s\S]*?\*\//,
      scope: 'comment.block.css',
      popState: true
    },
    {
      regex: /^[\s\S]+/,
      scope: 'comment.block.css'
    }
  ],

  'string-double': [
    {
      regex: /^[^\\"]*(?:\\.[^\\"]*)*"/,
      scope: 'string.quoted.double.css',
      popState: true
    },
    {
      regex: /^.*/,
      scope: 'string.quoted.double.css'
    }
  ],

  'string-single': [
    {
      regex: /^[^\\']*(?:\\.[^\\']*)*'/,
      scope: 'string.quoted.single.css',
      popState: true
    },
    {
      regex: /^.*/,
      scope: 'string.quoted.single.css'
    }
  ]
}
