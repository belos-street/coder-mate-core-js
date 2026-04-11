import type { GrammarRulesMap } from './type'

const GO_KEYWORDS_DECLARATION =
  /^(package|import|func|var|const|type|struct|interface|map|chan)\b/
const GO_KEYWORDS_CONTROL =
  /^(if|else|switch|case|default|for|range|select|go|defer|return|break|continue|fallthrough|goto)\b/
const GO_BUILTIN_TYPES =
  /^(any|comparable|error|string|bool|byte|rune|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|uintptr|float32|float64|complex64|complex128)\b/

/**
 * Go grammar rules (practical edition)
 */
export const GRAMMAR_RULES: GrammarRulesMap = {
  global: [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^\/\/.*/,
      scope: 'comment.line.double-slash.go'
    },
    {
      regex: /^\/\*/,
      scope: 'comment.block.go',
      pushState: 'comment-block'
    },
    {
      regex: /^`/,
      scope: 'string.quoted.raw.go',
      pushState: 'string-raw'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.go',
      pushState: 'string-double'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.go',
      pushState: 'string-single'
    },
    {
      regex: GO_KEYWORDS_DECLARATION,
      scope: 'keyword.declaration.go'
    },
    {
      regex: GO_KEYWORDS_CONTROL,
      scope: 'keyword.control.go'
    },
    {
      regex: GO_BUILTIN_TYPES,
      scope: 'support.type.builtin.go'
    },
    {
      regex: /^(true|false)\b/,
      scope: 'constant.language.boolean.go'
    },
    {
      regex: /^nil\b/,
      scope: 'constant.language.null.go'
    },
    {
      regex: /^iota\b/,
      scope: 'constant.language.iota.go'
    },
    {
      regex: /^[a-z_][A-Za-z0-9_]*(?=\.)/,
      scope: 'entity.name.namespace.go'
    },
    {
      regex: /^[A-Z][A-Za-z0-9_]*(?=\s*(?:\[|\.|,|\)|\{|=|$))/,
      scope: 'entity.name.type.go'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*(?=\s*\()/,
      scope: 'entity.name.function.go'
    },
    {
      regex:
        /^(?:0[xX][0-9A-Fa-f_]+|0[bB][01_]+|0[oO][0-7_]+|(?:\d[\d_]*)(?:\.\d[\d_]*)?(?:[eE][+-]?\d[\d_]*)?(?:i)?)/,
      scope: 'constant.numeric.go'
    },
    {
      regex:
        /^(?::=|==|!=|<=|>=|&&|\|\||<-|\+\+|--|\.\.\.|[-+*/%=&|^~!?<>:.;,()[\]{}])/,
      scope: 'operator.go'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'default'
    }
  ],

  'comment-block': [
    {
      regex: /^[\s\S]*?\*\//,
      scope: 'comment.block.go',
      popState: true
    },
    {
      regex: /^[\s\S]+/,
      scope: 'comment.block.go'
    }
  ],

  'string-double': [
    {
      regex: /^[^"\\\n]+/,
      scope: 'string.quoted.double.go'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.double.go'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.go',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.double.go'
    }
  ],

  'string-single': [
    {
      regex: /^[^'\\\n]+/,
      scope: 'string.quoted.single.go'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.single.go'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.go',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.single.go'
    }
  ],

  'string-raw': [
    {
      regex: /^[^`]+/,
      scope: 'string.quoted.raw.go'
    },
    {
      regex: /^`/,
      scope: 'string.quoted.raw.go',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.raw.go'
    }
  ]
}
