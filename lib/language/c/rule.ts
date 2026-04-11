import type { GrammarRulesMap } from './type'

const C_KEYWORDS_DECLARATION = /^(typedef|struct|union|enum)\b/
const C_KEYWORDS_MODIFIER =
  /^(static|extern|register|auto|const|volatile|restrict|inline|signed|unsigned|short|long)\b/
const C_KEYWORDS_CONTROL =
  /^(if|else|switch|case|default|for|while|do|break|continue|return|goto|sizeof)\b/
const C_PREPROCESSOR_DIRECTIVE =
  /^#\s*(?:include|define|undef|if|ifdef|ifndef|elif|else|endif|pragma|error|warning|line)\b/
const C_BUILTIN_TYPES =
  /^(void|char|int|float|double|_Bool|bool|size_t|ptrdiff_t|wchar_t|FILE|int8_t|int16_t|int32_t|int64_t|uint8_t|uint16_t|uint32_t|uint64_t)\b/

/**
 * C grammar rules (practical edition)
 */
export const GRAMMAR_RULES: GrammarRulesMap = {
  global: [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^\/\/.*/,
      scope: 'comment.line.double-slash.c'
    },
    {
      regex: /^\/\*/,
      scope: 'comment.block.c',
      pushState: 'comment-block'
    },
    {
      regex: C_PREPROCESSOR_DIRECTIVE,
      scope: 'keyword.control.directive.c'
    },
    {
      regex: /^<[^>\r\n]+>/,
      scope: 'string.quoted.angle.c'
    },
    {
      regex: /^#[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'meta.preprocessor.c'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.c',
      pushState: 'string-double'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.c',
      pushState: 'string-single'
    },
    {
      regex: C_KEYWORDS_DECLARATION,
      scope: 'keyword.declaration.c'
    },
    {
      regex: C_KEYWORDS_MODIFIER,
      scope: 'keyword.modifier.c'
    },
    {
      regex: C_KEYWORDS_CONTROL,
      scope: 'keyword.control.c'
    },
    {
      regex: C_BUILTIN_TYPES,
      scope: 'support.type.builtin.c'
    },
    {
      regex: /^(true|false)\b/,
      scope: 'constant.language.boolean.c'
    },
    {
      regex: /^NULL\b/,
      scope: 'constant.language.null.c'
    },
    {
      regex: /^(?:__[A-Z_][A-Z0-9_]*__|[A-Z][A-Z0-9_]*|[A-Z_][A-Z0-9_]*)(?=\b)/,
      scope: 'entity.name.macro.c'
    },
    {
      regex: /^[A-Z][A-Za-z0-9_]*_t\b|^[A-Z][A-Za-z0-9_]*\b/,
      scope: 'entity.name.type.c'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*(?=\s*\()/,
      scope: 'entity.name.function.c'
    },
    {
      regex:
        /^(?:0[xX][0-9A-Fa-f]+(?:[uUlL]{0,2})?|0[bB][01]+(?:[uUlL]{0,2})?|(?:\d+\.\d*|\.\d+|\d+)(?:[eE][+-]?\d+)?[fFlLuU]{0,3})/,
      scope: 'constant.numeric.c'
    },
    {
      regex: /^(?:->|==|!=|<=|>=|\+\+|--|&&|\|\||<<|>>|[-+*/%=&|^~!?<>:.;,()[\]{}])/,
      scope: 'operator.c'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'default'
    }
  ],

  'comment-block': [
    {
      regex: /^[\s\S]*?\*\//,
      scope: 'comment.block.c',
      popState: true
    },
    {
      regex: /^[\s\S]+/,
      scope: 'comment.block.c'
    }
  ],

  'string-double': [
    {
      regex: /^[^"\\\n]+/,
      scope: 'string.quoted.double.c'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.double.c'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.c',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.double.c'
    }
  ],

  'string-single': [
    {
      regex: /^[^'\\\n]+/,
      scope: 'string.quoted.single.c'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.single.c'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.c',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.single.c'
    }
  ]
}
