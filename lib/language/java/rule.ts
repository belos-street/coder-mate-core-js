import type { GrammarRulesMap } from './type'

const JAVA_KEYWORDS_DECLARATION =
  /^(package|import|class|interface|enum|record|extends|implements)\b/

const JAVA_KEYWORDS_MODIFIER =
  /^(public|protected|private|static|final|abstract|sealed|non-sealed|volatile|transient|native|strictfp|synchronized|default)\b/

const JAVA_KEYWORDS_CONTROL =
  /^(if|else|switch|case|for|while|do|break|continue|return|try|catch|finally|throw|throws|new|instanceof|assert|yield)\b/

const JAVA_BUILTIN_TYPES =
  /^(void|boolean|byte|short|int|long|float|double|char|var|String)\b/

/**
 * Java grammar rules (practical edition)
 */
export const GRAMMAR_RULES: GrammarRulesMap = {
  global: [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^\/\/.*/,
      scope: 'comment.line.double-slash.java'
    },
    {
      regex: /^\/\*/,
      scope: 'comment.block.java',
      pushState: 'comment-block'
    },
    {
      regex: /^"""/,
      scope: 'string.quoted.triple.java',
      pushState: 'string-text-block'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.java',
      pushState: 'string-double'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.java',
      pushState: 'string-single'
    },
    {
      regex: /^@[A-Za-z_][A-Za-z0-9_.]*/,
      scope: 'meta.annotation.java'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)+(?=\s*;)/,
      scope: 'entity.name.namespace.java'
    },
    {
      regex: JAVA_KEYWORDS_DECLARATION,
      scope: 'keyword.declaration.java'
    },
    {
      regex: JAVA_KEYWORDS_MODIFIER,
      scope: 'keyword.modifier.java'
    },
    {
      regex: JAVA_KEYWORDS_CONTROL,
      scope: 'keyword.control.java'
    },
    {
      regex: /^(true|false)\b/,
      scope: 'constant.language.boolean.java'
    },
    {
      regex: /^null\b/,
      scope: 'constant.language.null.java'
    },
    {
      regex: /^(this|super)\b/,
      scope: 'variable.language.java'
    },
    {
      regex: JAVA_BUILTIN_TYPES,
      scope: 'support.type.builtin.java'
    },
    {
      regex: /^[A-Z][A-Za-z0-9_]*(?=\s*(?:<|\.|\(|\{|\[|,|;|=|\)|$))/,
      scope: 'entity.name.type.java'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*(?=\s*\()/,
      scope: 'entity.name.function.java'
    },
    {
      regex:
        /^-?(?:0[xX][0-9A-Fa-f_]+|0[bB][01_]+|0[0-7_]+|(?:\d[\d_]*)(?:\.\d[\d_]*)?(?:[eE][+-]?\d[\d_]*)?)[fFdDlL]?/,
      scope: 'constant.numeric.java'
    },
    {
      regex: /^(?:->|::|==|!=|<=|>=|\+\+|--|&&|\|\||<<|>>>?|[-+*/%=&|^~!?<>:.;,()[\]{}])/,
      scope: 'operator.java'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'default'
    }
  ],

  'comment-block': [
    {
      regex: /^[\s\S]*?\*\//,
      scope: 'comment.block.java',
      popState: true
    },
    {
      regex: /^[\s\S]+/,
      scope: 'comment.block.java'
    }
  ],

  'string-double': [
    {
      regex: /^[^"\\\n]+/,
      scope: 'string.quoted.double.java'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.double.java'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.java',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.double.java'
    }
  ],

  'string-single': [
    {
      regex: /^[^'\\\n]+/,
      scope: 'string.quoted.single.java'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.single.java'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.java',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.single.java'
    }
  ],

  'string-text-block': [
    {
      regex: /^[\s\S]*?"""/,
      scope: 'string.quoted.triple.java',
      popState: true
    },
    {
      regex: /^[\s\S]+/,
      scope: 'string.quoted.triple.java'
    }
  ]
}
