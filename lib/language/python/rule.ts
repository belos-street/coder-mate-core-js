import type { GrammarRulesMap } from './type'

const PYTHON_BUILTINS =
  /^(print|len|range|str|int|float|dict|list|set|tuple|sum|min|max|abs|enumerate|zip|map|filter|any|all|open)\b/

const PYTHON_KEYWORDS =
  /^(if|elif|else|while|try|except|finally|with|pass|break|continue|return|raise|in|is|and|or|not|lambda|yield|await|async|from|import|match|case)\b/

const PYTHON_ANNOTATION_TYPE =
  /^(int|str|float|bool|list|dict|set|tuple|bytes|Any|Optional|Union|Literal|TypedDict|Callable|Iterator|Iterable|Sequence|Mapping|Self|(?!None\b)[A-Z][A-Za-z0-9_]*)\b/

/**
 * Python grammar rules (Phase 3 practical)
 */
export const GRAMMAR_RULES: GrammarRulesMap = {
  global: [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^#.*/,
      scope: 'comment.line.number-sign.python'
    },

    // decorator
    {
      regex: /^@[A-Za-z_][A-Za-z0-9_.]*/,
      scope: 'meta.decorator.python'
    },

    // f-string（三引号）
    {
      regex: /^(?:[fF][rR]?|[rR][fF])"""/,
      scope: 'string.interpolated.python',
      pushState: 'f-string-triple-double'
    },
    {
      regex: /^(?:[fF][rR]?|[rR][fF])'''/,
      scope: 'string.interpolated.python',
      pushState: 'f-string-triple-single'
    },

    // 普通三引号字符串
    {
      regex: /^(?:[rRuUbB])?"""/,
      scope: 'string.quoted.double.triple.python',
      pushState: 'string-triple-double'
    },
    {
      regex: /^(?:[rRuUbB])?'''/,
      scope: 'string.quoted.single.triple.python',
      pushState: 'string-triple-single'
    },

    // f-string（单/双引号）
    {
      regex: /^(?:[fF][rR]?|[rR][fF])"/,
      scope: 'string.interpolated.python',
      pushState: 'f-string-double'
    },
    {
      regex: /^(?:[fF][rR]?|[rR][fF])'/,
      scope: 'string.interpolated.python',
      pushState: 'f-string-single'
    },

    // 普通单/双引号字符串（支持前缀）
    {
      regex: /^(?:[rRuUbB])?"/,
      scope: 'string.quoted.double.python',
      pushState: 'string-double'
    },
    {
      regex: /^(?:[rRuUbB])?'/,
      scope: 'string.quoted.single.python',
      pushState: 'string-single'
    },

    // type annotation（实用版）
    {
      regex:
        /^->\s*(?:int|str|float|bool|list|dict|set|tuple|bytes|Any|Optional|Union|Literal|TypedDict|Callable|Iterator|Iterable|Sequence|Mapping|Self|(?!None\b)[A-Z][A-Za-z0-9_]*)/,
      scope: 'support.type.annotation.python'
    },
    {
      regex:
        /^:\s*(?:int|str|float|bool|list|dict|set|tuple|bytes|Any|Optional|Union|Literal|TypedDict|Callable|Iterator|Iterable|Sequence|Mapping|Self|(?!None\b)[A-Z][A-Za-z0-9_]*)/,
      scope: 'support.type.annotation.python'
    },

    {
      regex: /^(def)\b/,
      scope: 'keyword.declaration.python',
      pushState: 'expect-function-name'
    },
    {
      regex: /^(class)\b/,
      scope: 'keyword.declaration.python',
      pushState: 'expect-class-name'
    },
    {
      regex: /^(for)\b/,
      scope: 'keyword.control.python',
      pushState: 'expect-comprehension-target'
    },
    {
      regex: /^(as)\b/,
      scope: 'keyword.control.python',
      pushState: 'expect-as-alias'
    },
    {
      regex: PYTHON_KEYWORDS,
      scope: 'keyword.control.python'
    },
    {
      regex: PYTHON_BUILTINS,
      scope: 'support.function.builtin.python'
    },
    {
      regex: PYTHON_ANNOTATION_TYPE,
      scope: 'support.type.annotation.python'
    },
    {
      regex: /^(True|False)\b/,
      scope: 'constant.language.boolean.python'
    },
    {
      regex: /^None\b/,
      scope: 'constant.language.none.python'
    },
    {
      regex: /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/,
      scope: 'constant.numeric.python'
    },
    {
      regex: /^(==|!=|<=|>=|\*\*|\/\/|->|:=|[+\-*/%=<>{}\[\]():.,|])/,
      scope: 'operator.python'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'variable.identifier.python'
    }
  ],

  'expect-function-name': [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'entity.name.function.python',
      popState: true
    },
    {
      regex: /^./,
      scope: 'default',
      popState: true
    }
  ],

  'expect-class-name': [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'entity.name.class.python',
      popState: true
    },
    {
      regex: /^./,
      scope: 'default',
      popState: true
    }
  ],

  'expect-comprehension-target': [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^(in)\b/,
      scope: 'keyword.control.python',
      popState: true
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'variable.comprehension.python'
    },
    {
      regex: /^(,|\(|\)|\[|\])/,
      scope: 'operator.python'
    },
    {
      regex: /^./,
      scope: 'default',
      popState: true
    }
  ],

  'expect-as-alias': [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'variable.alias.python',
      popState: true
    },
    {
      regex: /^./,
      scope: 'default',
      popState: true
    }
  ],

  'string-single': [
    {
      regex: /^[^\\']*(?:\\.[^\\']*)*'/,
      scope: 'string.quoted.single.python',
      popState: true
    },
    {
      regex: /^.*/,
      scope: 'string.quoted.single.python'
    }
  ],

  'string-double': [
    {
      regex: /^[^\\"]*(?:\\.[^\\"]*)*"/,
      scope: 'string.quoted.double.python',
      popState: true
    },
    {
      regex: /^.*/,
      scope: 'string.quoted.double.python'
    }
  ],

  'string-triple-single': [
    {
      regex: /^[\s\S]*?'''/,
      scope: 'string.quoted.single.triple.python',
      popState: true
    },
    {
      regex: /^[\s\S]*/,
      scope: 'string.quoted.single.triple.python'
    }
  ],

  'string-triple-double': [
    {
      regex: /^[\s\S]*?"""/,
      scope: 'string.quoted.double.triple.python',
      popState: true
    },
    {
      regex: /^[\s\S]*/,
      scope: 'string.quoted.double.triple.python'
    }
  ],

  'f-string-single': [
    {
      regex: /^{{|^}}/,
      scope: 'string.interpolated.python'
    },
    {
      regex: /^\{/,
      scope: 'punctuation.definition.interpolation.begin.python',
      pushState: 'f-string-interpolation'
    },
    {
      regex: /^'/,
      scope: 'string.interpolated.python',
      popState: true
    },
    {
      regex: /^[^\\{'\n]+/,
      scope: 'string.interpolated.python'
    },
    {
      regex: /^\\./,
      scope: 'string.interpolated.python'
    },
    {
      regex: /^./,
      scope: 'string.interpolated.python'
    }
  ],

  'f-string-double': [
    {
      regex: /^{{|^}}/,
      scope: 'string.interpolated.python'
    },
    {
      regex: /^\{/,
      scope: 'punctuation.definition.interpolation.begin.python',
      pushState: 'f-string-interpolation'
    },
    {
      regex: /^"/,
      scope: 'string.interpolated.python',
      popState: true
    },
    {
      regex: /^[^\\{"\n]+/,
      scope: 'string.interpolated.python'
    },
    {
      regex: /^\\./,
      scope: 'string.interpolated.python'
    },
    {
      regex: /^./,
      scope: 'string.interpolated.python'
    }
  ],

  'f-string-triple-single': [
    {
      regex: /^{{|^}}/,
      scope: 'string.interpolated.python'
    },
    {
      regex: /^\{/,
      scope: 'punctuation.definition.interpolation.begin.python',
      pushState: 'f-string-interpolation'
    },
    {
      regex: /^'''/,
      scope: 'string.interpolated.python',
      popState: true
    },
    {
      regex: /^\\./,
      scope: 'string.interpolated.python'
    },
    {
      regex: /^./,
      scope: 'string.interpolated.python'
    }
  ],

  'f-string-triple-double': [
    {
      regex: /^{{|^}}/,
      scope: 'string.interpolated.python'
    },
    {
      regex: /^\{/,
      scope: 'punctuation.definition.interpolation.begin.python',
      pushState: 'f-string-interpolation'
    },
    {
      regex: /^"""/,
      scope: 'string.interpolated.python',
      popState: true
    },
    {
      regex: /^\\./,
      scope: 'string.interpolated.python'
    },
    {
      regex: /^./,
      scope: 'string.interpolated.python'
    }
  ],

  'f-string-interpolation': [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^\{/,
      scope: 'punctuation.definition.interpolation.begin.python',
      pushState: 'f-string-interpolation'
    },
    {
      regex: /^}/,
      scope: 'punctuation.definition.interpolation.end.python',
      popState: true
    },
    {
      regex: /^![sra]/,
      scope: 'punctuation.format.fstring.python'
    },
    {
      regex: /^:/,
      scope: 'punctuation.format.fstring.python'
    },
    {
      regex: /^(def|class)\b/,
      scope: 'keyword.declaration.python'
    },
    {
      regex: /^(for)\b/,
      scope: 'keyword.control.python',
      pushState: 'expect-comprehension-target'
    },
    {
      regex: /^(as)\b/,
      scope: 'keyword.control.python',
      pushState: 'expect-as-alias'
    },
    {
      regex: PYTHON_KEYWORDS,
      scope: 'keyword.control.python'
    },
    {
      regex: PYTHON_BUILTINS,
      scope: 'support.function.builtin.python'
    },
    {
      regex: PYTHON_ANNOTATION_TYPE,
      scope: 'support.type.annotation.python'
    },
    {
      regex: /^(True|False)\b/,
      scope: 'constant.language.boolean.python'
    },
    {
      regex: /^None\b/,
      scope: 'constant.language.none.python'
    },
    {
      regex: /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/,
      scope: 'constant.numeric.python'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.python',
      pushState: 'string-double'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.python',
      pushState: 'string-single'
    },
    {
      regex: /^(==|!=|<=|>=|\*\*|\/\/|->|:=|[+\-*/%=<>{}\[\]():.,|])/,
      scope: 'operator.python'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'variable.identifier.python'
    }
  ]
}
