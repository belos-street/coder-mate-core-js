import type { GrammarRulesMap } from './type'

const PHP_KEYWORDS_DECLARATION =
  /^(namespace|use|class|interface|trait|enum|function|const)\b/
const PHP_KEYWORDS_MODIFIER =
  /^(public|private|protected|static|final|abstract|readonly)\b/
const PHP_KEYWORDS_CONTROL =
  /^(if|else|elseif|switch|case|default|for|foreach|while|do|break|continue|return|try|catch|finally|throw|match|yield|as|new|instanceof|echo|include|require|include_once|require_once|fn)\b/
const PHP_BUILTIN_TYPES =
  /^(int|float|string|bool|array|object|mixed|void|null|callable|iterable|self|parent|never)\b/

/**
 * PHP grammar rules (practical edition)
 */
export const GRAMMAR_RULES: GrammarRulesMap = {
  global: [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^\/\/.*/,
      scope: 'comment.line.double-slash.php'
    },
    {
      regex: /^#(?!\[).*/,
      scope: 'comment.line.number-sign.php'
    },
    {
      regex: /^\/\*/,
      scope: 'comment.block.php',
      pushState: 'comment-block'
    },
    {
      regex: /^<\?(?:php|=)?|^\?>/,
      scope: 'meta.tag.php'
    },
    {
      regex: /^#\[[^\]\r\n]+\]/,
      scope: 'meta.attribute.php'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.php',
      pushState: 'string-double'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.php',
      pushState: 'string-single'
    },
    {
      regex: /^`/,
      scope: 'string.quoted.backtick.php',
      pushState: 'string-backtick'
    },
    {
      regex:
        /^[A-Za-z_\x80-\xff][A-Za-z0-9_\x80-\xff]*(?:\\[A-Za-z_\x80-\xff][A-Za-z0-9_\x80-\xff]*)+(?=\s*(?:;|,|\)|\{|$))/,
      scope: 'entity.name.namespace.php'
    },
    {
      regex: PHP_KEYWORDS_DECLARATION,
      scope: 'keyword.declaration.php'
    },
    {
      regex: PHP_KEYWORDS_MODIFIER,
      scope: 'keyword.modifier.php'
    },
    {
      regex: PHP_KEYWORDS_CONTROL,
      scope: 'keyword.control.php'
    },
    {
      regex: /^(true|false)\b/i,
      scope: 'constant.language.boolean.php'
    },
    {
      regex: /^null\b/i,
      scope: 'constant.language.null.php'
    },
    {
      regex: /^__(?:FILE|DIR|LINE|FUNCTION|CLASS|METHOD|NAMESPACE|TRAIT)__\b/,
      scope: 'constant.language.php'
    },
    {
      regex: PHP_BUILTIN_TYPES,
      scope: 'support.type.builtin.php'
    },
    {
      regex: /^\$this\b/,
      scope: 'variable.language.php'
    },
    {
      regex: /^\$[A-Za-z_\x80-\xff][A-Za-z0-9_\x80-\xff]*/,
      scope: 'variable.other.php'
    },
    {
      regex: /^[A-Za-z_\x80-\xff][A-Za-z0-9_\x80-\xff]*(?=\s*\()/,
      scope: 'entity.name.function.php'
    },
    {
      regex: /^[A-Z][A-Za-z0-9_\x80-\xff]*(?=\s*(?:\(|\{|:|,|;|=|$))/,
      scope: 'entity.name.type.php'
    },
    {
      regex:
        /^(?:0[xX][0-9A-Fa-f_]+|0[bB][01_]+|0[oO][0-7_]+|(?:\d[\d_]*)(?:\.\d[\d_]*)?(?:[eE][+-]?\d[\d_]*)?)/,
      scope: 'constant.numeric.php'
    },
    {
      regex:
        /^(?:\?\?=|\?\?|=>|->|::|===|!==|==|!=|<=|>=|<=>|&&|\|\||\+=|-=|\*=|\/=|%=|\.=|&=|\|=|\^=|<<|>>|[-+*/%=&|^~!?<>:.;,()[\]{}])/,
      scope: 'operator.php'
    },
    {
      regex: /^[A-Za-z_\x80-\xff][A-Za-z0-9_\x80-\xff]*/,
      scope: 'default'
    }
  ],

  'comment-block': [
    {
      regex: /^[\s\S]*?\*\//,
      scope: 'comment.block.php',
      popState: true
    },
    {
      regex: /^[\s\S]+/,
      scope: 'comment.block.php'
    }
  ],

  'string-double': [
    {
      regex: /^[^"\\$\n]+/,
      scope: 'string.quoted.double.php'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.double.php'
    },
    {
      regex: /^\$[A-Za-z_\x80-\xff][A-Za-z0-9_\x80-\xff]*/,
      scope: 'variable.other.php'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.php',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.double.php'
    }
  ],

  'string-single': [
    {
      regex: /^[^'\\\n]+/,
      scope: 'string.quoted.single.php'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.single.php'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.php',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.single.php'
    }
  ],

  'string-backtick': [
    {
      regex: /^[^`\\\n]+/,
      scope: 'string.quoted.backtick.php'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.backtick.php'
    },
    {
      regex: /^`/,
      scope: 'string.quoted.backtick.php',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.backtick.php'
    }
  ]
}
