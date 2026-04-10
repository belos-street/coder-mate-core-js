import type { GrammarRulesMap } from './type'

/**
 * ES2020 语法规则
 * 参考 demo.html 的规则设计
 */
export const GRAMMAR_RULES: GrammarRulesMap = {
  // ==================== global 状态 ====================
  // 全局状态：解析所有顶层语法
  global: [
    // === 1. 注释规则 ===
    {
      regex: /^\/\/.*/,
      scope: 'comment.line.double-slash.js'
    },
    {
      regex: /^\/\*/,
      scope: 'comment.block.js',
      pushState: 'multiline-comment'
    },

    // === 2. 模块化语法（ES2020）===
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

    // === 3. ES2020 关键字/全局变量 ===
    {
      regex: /^(globalThis)\b/,
      scope: 'variable.language.global-this.js'
    },
    {
      regex: /^(Promise\.allSettled)\b/,
      scope: 'support.function.promise.js'
    },

    // === 4. 控制流/声明关键字 ===
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
      regex: /^(class|extends|static|constructor)\b/,
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

    // === 5. 运算符（ES2020新增）===
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
        /^(===|!==|==|!=|>=|<=|&&|\|\||\+\+|--|\+|-|\*|\/|%|=|>|<|!|\.|,|:|;|\(|\)|\{|\}|\[|\])/,
      scope: 'operator.js'
    },

    // === 6. 值类型 ===
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

    // === 7. 标识符（普通变量/函数名）===
    {
      regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/,
      scope: 'variable.identifier.js'
    }
  ],

  // ==================== multiline-comment 状态 ====================
  // 多行注释状态：/* ... */
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

  // ==================== string-double 状态 ====================
  // 双引号字符串状态（处理转义）
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

  // ==================== string-single 状态 ====================
  // 单引号字符串状态（处理转义）
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

  // ==================== string-backtick 状态 ====================
  // 反引号模板字符串状态（含插值）
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

  // ==================== template-interpolation 状态 ====================
  // 模板插值状态（${}内的 JS 代码）
  'template-interpolation': [
    {
      regex: /^}/,
      scope: 'punctuation.definition.template-expression.js',
      popState: true
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
      regex: /^[+\-*/=<>!&|.,;:()[\]]/,
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

  // ==================== import-dynamic 状态 ====================
  // 动态导入import()状态
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
      regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/,
      scope: 'variable.identifier.js'
    },
    {
      regex: /^[+\-*/=<>!&|.,;:()[\]{}]/,
      scope: 'operator.js'
    },
    {
      regex: /^./,
      scope: 'variable.identifier.js'
    }
  ]
}
