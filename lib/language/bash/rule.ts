import type { GrammarRulesMap } from './type'

const BASH_KEYWORDS =
  /^(if|then|else|elif|fi|for|while|until|do|done|case|esac|in|select|time|coproc)\b/
const BASH_BUILTINS =
  /^(echo|printf|read|cd|pwd|export|unset|alias|unalias|source|set|shift|test|true|false|trap|exec|exit|return|local|declare|typeset|readonly|mapfile|wait|kill|jobs|fg|bg)\b/

/**
 * Bash grammar rules (practical edition)
 */
export const GRAMMAR_RULES: GrammarRulesMap = {
  global: [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^#.*/,
      scope: 'comment.line.number-sign.bash'
    },
    {
      regex: /^(function)\b/,
      scope: 'keyword.declaration.function.bash',
      pushState: 'expect-function-name'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*(?=\s*\(\s*\))/,
      scope: 'entity.name.function.bash'
    },
    {
      regex: BASH_KEYWORDS,
      scope: 'keyword.control.bash'
    },
    {
      regex: BASH_BUILTINS,
      scope: 'support.function.builtin.bash'
    },
    {
      regex: /^\$(?:[@*#?$!0-9]|-[A-Za-z?])/,
      scope: 'variable.language.special.bash'
    },
    {
      regex: /^\$\{[A-Za-z0-9_]+(?::[-=?+][^}]*)?\}/,
      scope: 'variable.parameter.bash'
    },
    {
      regex: /^\$[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'variable.parameter.bash'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*(?==)/,
      scope: 'variable.other.readwrite.bash'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.bash',
      pushState: 'string-double'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.bash',
      pushState: 'string-single'
    },
    {
      regex: /^-?(?:0|[1-9]\d*)(?:\.\d+)?/,
      scope: 'constant.numeric.bash'
    },
    {
      regex: /^(?:\|\||&&|\|&|>>|<<-?|<&|>&|\||>|<|;;|;|&|\(|\)|\{|\}|\[|\]|=)/,
      scope: 'operator.bash'
    },
    {
      regex: /^[A-Za-z_./-][A-Za-z0-9_./-]*/,
      scope: 'entity.name.command.bash'
    }
  ],

  'expect-function-name': [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'entity.name.function.bash',
      popState: true
    },
    {
      regex: /^./,
      scope: 'default',
      popState: true
    }
  ],

  'string-double': [
    {
      regex: /^\$(?:[@*#?$!0-9]|-[A-Za-z?])/,
      scope: 'variable.language.special.bash'
    },
    {
      regex: /^\$\{[A-Za-z0-9_]+(?::[-=?+][^}]*)?\}/,
      scope: 'variable.parameter.bash'
    },
    {
      regex: /^\$[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'variable.parameter.bash'
    },
    {
      regex: /^[^\\"$\n]+/,
      scope: 'string.quoted.double.bash'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.double.bash'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.bash',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.double.bash'
    }
  ],

  'string-single': [
    {
      regex: /^[^'\n]+'/,
      scope: 'string.quoted.single.bash',
      popState: true
    },
    {
      regex: /^[^'\n]+/,
      scope: 'string.quoted.single.bash'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.bash',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.single.bash'
    }
  ]
}
