import type { GrammarRulesMap } from './type'

/**
 * JSON grammar rules
 */
export const GRAMMAR_RULES: GrammarRulesMap = {
  global: [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.json',
      pushState: 'string-double'
    },
    {
      regex: /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/,
      scope: 'constant.numeric.json'
    },
    {
      regex: /^(true|false)\b/,
      scope: 'constant.language.boolean.json'
    },
    {
      regex: /^null\b/,
      scope: 'constant.language.null.json'
    },
    {
      regex: /^:/,
      scope: 'punctuation.separator.key-value.json'
    },
    {
      regex: /^,/,
      scope: 'punctuation.separator.value.json'
    },
    {
      regex: /^[{}]/,
      scope: 'meta.structure.dictionary.json'
    },
    {
      regex: /^[\[\]]/,
      scope: 'meta.structure.array.json'
    }
  ],

  'string-double': [
    {
      regex: /^[^\\"]*(?:\\.[^\\"]*)*"/,
      scope: 'string.quoted.double.json',
      popState: true
    },
    {
      regex: /^.*/,
      scope: 'string.quoted.double.json'
    }
  ]
}
