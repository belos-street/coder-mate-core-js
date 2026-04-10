import type { GrammarRulesMap } from './type'

export const GRAMMAR_RULES: GrammarRulesMap = {
  global: [
    {
      regex: /^\/\/.*/,
      scope: 'comment.line.double-slash.js'
    },
    {
      regex: /^\/\*/,
      scope: 'comment.block.js',
      pushState: 'multiline-comment'
    },

    {
      regex: /^(import)\s*\(/,
      scope: 'keyword.control.import.js',
      pushState: 'import-dynamic'
    },
    {
      regex: /^(export)\s*\*\s*as\s*(\w+)\s*from/,
      scope: 'keyword.control.module.js'
    },
    {
      regex: /^(import|export)\b/,
      scope: 'keyword.control.module.js'
    },

    {
      regex: /^(type|interface|enum|namespace)\b/,
      scope: 'keyword.declaration.type.typescript',
      pushState: 'expect-type-name'
    },
    {
      regex: /^(implements)\b/,
      scope: 'keyword.declaration.type.typescript',
      pushState: 'expect-type-name'
    },
    {
      regex: /^(declare)\b/,
      scope: 'keyword.declaration.type.typescript'
    },
    {
      regex: /^(public|private|protected|readonly|abstract|override)\b/,
      scope: 'keyword.modifier.access.typescript'
    },
    {
      regex: /^(as)\b/,
      scope: 'keyword.operator.assertion.typescript'
    },
    {
      regex: /^(satisfies|keyof|typeof|infer|is|asserts|in|extends)\b/,
      scope: 'keyword.operator.type.typescript'
    },
    {
      regex:
        /^(string|number|boolean|any|unknown|never|void|object|symbol|bigint|Array|Promise|Record|Partial|Pick|Omit|Readonly|Required)\b/,
      scope: 'support.type.builtin.typescript'
    },
    {
      regex: /^[A-Z][a-zA-Z0-9_$]*/,
      scope: 'entity.name.type.typescript'
    },

    {
      regex: /^(globalThis)\b/,
      scope: 'variable.language.global-this.js'
    },
    {
      regex: /^(Promise\.allSettled)\b/,
      scope: 'support.function.promise.js'
    },

    {
      regex:
        /^(if|else|for|while|do|switch|case|break|continue|return|throw|try|catch|finally)\b/,
      scope: 'keyword.control.js'
    },
    {
      regex: /^(async|await)\b/,
      scope: 'keyword.control.async.js'
    },
    {
      regex: /^(class)\b/,
      scope: 'keyword.control.class.js',
      pushState: 'class-after-name'
    },
    {
      regex: /^(static|constructor)\b/,
      scope: 'keyword.control.class.js'
    },
    {
      regex: /^(function|var|let|const)\b/,
      scope: 'keyword.declaration.js'
    },
    {
      regex: /^(true|false)\b/,
      scope: 'constant.language.boolean.js'
    },
    {
      regex: /^(null|undefined)\b/,
      scope: 'constant.language.null.js'
    },

    {
      regex: /^(\?\.)/,
      scope: 'operator.optional-chaining.js'
    },
    {
      regex: /^(\?\?)/,
      scope: 'operator.nullish-coalescing.js'
    },
    {
      regex: /^=>/,
      scope: 'operator.arrow-function.js'
    },
    {
      regex:
        /^(\.\.\.|===|!==|==|!=|>=|<=|&&|\|\||\+\+|--|\+|-|\*|\/|%|=|>|<|!|&|\||\?|\.|,|:|;|\(|\)|\{|\}|\[|\])/,
      scope: 'operator.js'
    },

    {
      regex:
        /^(0b[01]+n?|0o[0-7]+n?|0x[0-9a-fA-F]+n?|\d+\.?\d*e?\d*n?|\.\d+e?\d*n?)/,
      scope: 'constant.numeric.js'
    },
    {
      regex: /^`/,
      scope: 'string.quoted.backtick.js',
      pushState: 'string-backtick'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.js',
      pushState: 'string-double'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.js',
      pushState: 'string-single'
    },

    {
      regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/,
      scope: 'variable.identifier.js'
    }
  ],

  'expect-type-name': [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/,
      scope: 'entity.name.type.typescript',
      popState: true
    },
    {
      regex: /^./,
      scope: 'default',
      popState: true
    }
  ],

  'class-after-name': [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^(implements)\b/,
      scope: 'keyword.declaration.type.typescript',
      pushState: 'expect-type-name'
    },
    {
      regex: /^(extends)\b/,
      scope: 'keyword.control.class.js',
      pushState: 'expect-type-name'
    },
    {
      regex: /^(satisfies|keyof|typeof|infer|is|asserts|in)\b/,
      scope: 'keyword.operator.type.typescript'
    },
    {
      regex: /^</,
      scope: 'operator.js',
      pushState: 'class-type-parameter'
    },
    {
      regex: /^\{/,
      scope: 'operator.js',
      popState: true
    },
    {
      regex: /^[A-Z][a-zA-Z0-9_$]*/,
      scope: 'entity.name.type.typescript'
    },
    {
      regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/,
      scope: 'variable.identifier.js'
    },
    {
      regex: /^(\.\.\.|[+\-*/=<>!&|.,;:?()[\]])/,
      scope: 'operator.js'
    },
    {
      regex: /^./,
      scope: 'default'
    }
  ],

  'class-type-parameter': [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^</,
      scope: 'operator.js',
      pushState: 'class-type-parameter'
    },
    {
      regex: /^>/,
      scope: 'operator.js',
      popState: true
    },
    {
      regex: /^(satisfies|keyof|typeof|infer|is|asserts|in|extends)\b/,
      scope: 'keyword.operator.type.typescript'
    },
    {
      regex:
        /^(string|number|boolean|any|unknown|never|void|object|symbol|bigint|Array|Promise|Record|Partial|Pick|Omit|Readonly|Required)\b/,
      scope: 'support.type.builtin.typescript'
    },
    {
      regex: /^`/,
      scope: 'string.quoted.backtick.js',
      pushState: 'string-backtick'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.js',
      pushState: 'string-double'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.js',
      pushState: 'string-single'
    },
    {
      regex: /^[A-Z][a-zA-Z0-9_$]*/,
      scope: 'entity.name.type.typescript'
    },
    {
      regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/,
      scope: 'variable.identifier.js'
    },
    {
      regex: /^(\.\.\.|[+\-*/=<>!&|.,;:?()[\]{}])/,
      scope: 'operator.js'
    },
    {
      regex: /^./,
      scope: 'default'
    }
  ],

  'multiline-comment': [
    {
      regex: /^[\s\S]*?\*\//,
      scope: 'comment.block.js',
      popState: true
    },
    {
      regex: /^[\s\S]*/,
      scope: 'comment.block.js'
    }
  ],

  'string-double': [
    {
      regex: /^[^\\"]*(?:\\.[^\\"]*)*"/,
      scope: 'string.quoted.double.js',
      popState: true
    },
    {
      regex: /^.*/,
      scope: 'string.quoted.double.js'
    }
  ],

  'string-single': [
    {
      regex: /^[^\\']*(?:\\.[^\\']*)*'/,
      scope: 'string.quoted.single.js',
      popState: true
    },
    {
      regex: /^.*/,
      scope: 'string.quoted.single.js'
    }
  ],

  'string-backtick': [
    {
      regex: /^\$\{/,
      scope: 'punctuation.definition.template-expression.js',
      pushState: 'template-interpolation'
    },
    {
      regex: /^[^\\`\$]+/,
      scope: 'string.quoted.backtick.js'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.backtick.js'
    },
    {
      regex: /^\$/,
      scope: 'string.quoted.backtick.js'
    },
    {
      regex: /^`/,
      scope: 'string.quoted.backtick.js',
      popState: true
    }
  ],

  'template-interpolation': [
    {
      regex: /^}/,
      scope: 'punctuation.definition.template-expression.js',
      popState: true
    },
    {
      regex: /^(type|interface|enum|implements)\b/,
      scope: 'keyword.declaration.type.typescript'
    },
    {
      regex: /^(as)\b/,
      scope: 'keyword.operator.assertion.typescript'
    },
    {
      regex: /^(satisfies|keyof|typeof|infer|is|asserts|in|extends)\b/,
      scope: 'keyword.operator.type.typescript'
    },
    {
      regex:
        /^(string|number|boolean|any|unknown|never|void|object|symbol|bigint|Array|Promise|Record|Partial|Pick|Omit|Readonly|Required)\b/,
      scope: 'support.type.builtin.typescript'
    },
    {
      regex: /^[A-Z][a-zA-Z0-9_$]*/,
      scope: 'entity.name.type.typescript'
    },
    {
      regex: /^(if|else|const|let|var|async|await)\b/,
      scope: 'keyword.control.js'
    },
    {
      regex: /^(true|false|null|undefined)\b/,
      scope: 'constant.language.js'
    },
    {
      regex: /^(\?\.|\?\?)/,
      scope: 'operator.js'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.js',
      pushState: 'string-double'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.js',
      pushState: 'string-single'
    },
    {
      regex: /^\d+n?/,
      scope: 'constant.numeric.js'
    },
    {
      regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/,
      scope: 'variable.identifier.js'
    },
    {
      regex: /^(\.\.\.|[+\-*/=<>!&|.,;:?()[\]])/,
      scope: 'operator.js'
    },
    {
      regex: /^\{/,
      scope: 'operator.js'
    },
    {
      regex: /^./,
      scope: 'variable.identifier.js'
    }
  ],

  'import-dynamic': [
    {
      regex: /^\)/,
      scope: 'operator.js',
      popState: true
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.js',
      pushState: 'string-double'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.js',
      pushState: 'string-single'
    },
    {
      regex: /^(as)\b/,
      scope: 'keyword.operator.assertion.typescript'
    },
    {
      regex: /^(satisfies|keyof|typeof|infer|is|asserts|in|extends)\b/,
      scope: 'keyword.operator.type.typescript'
    },
    {
      regex: /^[A-Z][a-zA-Z0-9_$]*/,
      scope: 'entity.name.type.typescript'
    },
    {
      regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/,
      scope: 'variable.identifier.js'
    },
    {
      regex: /^(\.\.\.|[+\-*/=<>!&|.,;:?()[\]{}])/,
      scope: 'operator.js'
    },
    {
      regex: /^./,
      scope: 'variable.identifier.js'
    }
  ]
}
