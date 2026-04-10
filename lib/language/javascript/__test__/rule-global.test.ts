import { test, expect, describe } from 'bun:test'
import { GRAMMAR_RULES } from '../rule'
import { matchToken, createInitialContext } from '../engine'

describe('global 状态规则测试', () => {
  describe('注释规则', () => {
    test('单行注释', () => {
      const context = createInitialContext()
      const result = matchToken('// this is a comment\n', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('// this is a comment')
      expect(result!.token.scope).toBe('comment.line.double-slash.js')
    })

    test('多行注释开始', () => {
      const context = createInitialContext()
      const result = matchToken('/* comment */', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('/*')
      expect(result!.token.scope).toBe('comment.block.js')
      expect(result!.newContext.stateStack).toEqual(['global', 'multiline-comment'])
    })
  })

  describe('关键字规则', () => {
    test('控制流关键字', () => {
      const keywords = ['if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'return', 'throw', 'try', 'catch', 'finally']
      
      keywords.forEach(keyword => {
        const context = createInitialContext()
        const result = matchToken(keyword + ' ', context)
        
        expect(result).not.toBeNull()
        expect(result!.token.text).toBe(keyword)
        expect(result!.token.scope).toBe('keyword.control.js')
      })
    })

    test('async/await 关键字', () => {
      const context1 = createInitialContext()
      const result1 = matchToken('async function() {}', context1)
      
      expect(result1).not.toBeNull()
      expect(result1!.token.text).toBe('async')
      expect(result1!.token.scope).toBe('keyword.control.async.js')

      const context2 = createInitialContext()
      const result2 = matchToken('await promise', context2)
      
      expect(result2).not.toBeNull()
      expect(result2!.token.text).toBe('await')
      expect(result2!.token.scope).toBe('keyword.control.async.js')
    })

    test('class 相关关键字', () => {
      const keywords = ['class', 'extends', 'static', 'constructor']
      
      keywords.forEach(keyword => {
        const context = createInitialContext()
        const result = matchToken(keyword + ' ', context)
        
        expect(result).not.toBeNull()
        expect(result!.token.text).toBe(keyword)
        expect(result!.token.scope).toBe('keyword.control.class.js')
      })
    })

    test('声明关键字', () => {
      const keywords = ['function', 'var', 'let', 'const']
      
      keywords.forEach(keyword => {
        const context = createInitialContext()
        const result = matchToken(keyword + ' x', context)
        
        expect(result).not.toBeNull()
        expect(result!.token.text).toBe(keyword)
        expect(result!.token.scope).toBe('keyword.declaration.js')
      })
    })

    test('布尔值', () => {
      const context1 = createInitialContext()
      const result1 = matchToken('true', context1)
      
      expect(result1).not.toBeNull()
      expect(result1!.token.text).toBe('true')
      expect(result1!.token.scope).toBe('constant.language.boolean.js')

      const context2 = createInitialContext()
      const result2 = matchToken('false', context2)
      
      expect(result2).not.toBeNull()
      expect(result2!.token.text).toBe('false')
      expect(result2!.token.scope).toBe('constant.language.boolean.js')
    })

    test('null/undefined', () => {
      const context1 = createInitialContext()
      const result1 = matchToken('null', context1)
      
      expect(result1).not.toBeNull()
      expect(result1!.token.text).toBe('null')
      expect(result1!.token.scope).toBe('constant.language.null.js')

      const context2 = createInitialContext()
      const result2 = matchToken('undefined', context2)
      
      expect(result2).not.toBeNull()
      expect(result2!.token.text).toBe('undefined')
      expect(result2!.token.scope).toBe('constant.language.null.js')
    })
  })

  describe('ES2020 特性', () => {
    test('globalThis', () => {
      const context = createInitialContext()
      const result = matchToken('globalThis', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('globalThis')
      expect(result!.token.scope).toBe('variable.language.global-this.js')
    })

    test('Promise.allSettled', () => {
      const context = createInitialContext()
      const result = matchToken('Promise.allSettled', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('Promise.allSettled')
      expect(result!.token.scope).toBe('support.function.promise.js')
    })

    test('可选链 ?.', () => {
      const context = createInitialContext()
      const result = matchToken('?.property', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('?.')
      expect(result!.token.scope).toBe('operator.optional-chaining.js')
    })

    test('空值合并 ??', () => {
      const context = createInitialContext()
      const result = matchToken('?? value', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('??')
      expect(result!.token.scope).toBe('operator.nullish-coalescing.js')
    })
  })

  describe('模块化语法', () => {
    test('import 关键字', () => {
      const context = createInitialContext()
      const result = matchToken('import { foo } from "./module"', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('import')
      expect(result!.token.scope).toBe('keyword.control.module.js')
    })

    test('export 关键字', () => {
      const context = createInitialContext()
      const result = matchToken('export const x = 1', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('export')
      expect(result!.token.scope).toBe('keyword.control.module.js')
    })

    test('export * as ... from 优先匹配具体规则', () => {
      const context = createInitialContext()
      const result = matchToken('export * as ns from "./module.js"', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('export * as ns from')
      expect(result!.token.scope).toBe('keyword.control.module.js')
    })

    test('动态 import()', () => {
      const context = createInitialContext()
      const result = matchToken('import("./module.js")', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('import(')
      expect(result!.token.scope).toBe('keyword.control.import.js')
      expect(result!.newContext.stateStack).toEqual(['global', 'import-dynamic'])
    })
  })

  describe('运算符', () => {
    test('比较运算符', () => {
      const operators = ['===', '!==', '==', '!=', '>=', '<=']
      
      operators.forEach(op => {
        const context = createInitialContext()
        const result = matchToken(op + ' value', context)
        
        expect(result).not.toBeNull()
        expect(result!.token.text).toBe(op)
        expect(result!.token.scope).toBe('operator.js')
      })
    })

    test('逻辑运算符', () => {
      const context1 = createInitialContext()
      const result1 = matchToken('&& condition', context1)
      
      expect(result1).not.toBeNull()
      expect(result1!.token.text).toBe('&&')
      expect(result1!.token.scope).toBe('operator.js')

      const context2 = createInitialContext()
      const result2 = matchToken('|| condition', context2)
      
      expect(result2).not.toBeNull()
      expect(result2!.token.text).toBe('||')
      expect(result2!.token.scope).toBe('operator.js')
    })

    test('算术运算符', () => {
      const operators = ['+', '-', '*', '/', '%']
      
      operators.forEach(op => {
        const context = createInitialContext()
        const result = matchToken(op + ' 1', context)
        
        expect(result).not.toBeNull()
        expect(result!.token.text).toBe(op)
        expect(result!.token.scope).toBe('operator.js')
      })
    })

    test('箭头函数', () => {
      const context = createInitialContext()
      const result = matchToken('=> {}', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('=>')
      expect(result!.token.scope).toBe('operator.arrow-function.js')
    })
  })

  describe('数字', () => {
    test('十进制数字', () => {
      const context = createInitialContext()
      const result = matchToken('123', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('123')
      expect(result!.token.scope).toBe('constant.numeric.js')
    })

    test('浮点数', () => {
      const context = createInitialContext()
      const result = matchToken('3.14', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('3.14')
      expect(result!.token.scope).toBe('constant.numeric.js')
    })

    test('BigInt', () => {
      const context = createInitialContext()
      const result = matchToken('123n', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('123n')
      expect(result!.token.scope).toBe('constant.numeric.js')
    })

    test('二进制数字', () => {
      const context = createInitialContext()
      const result = matchToken('0b1010', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('0b1010')
      expect(result!.token.scope).toBe('constant.numeric.js')
    })

    test('八进制数字', () => {
      const context = createInitialContext()
      const result = matchToken('0o755', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('0o755')
      expect(result!.token.scope).toBe('constant.numeric.js')
    })

    test('十六进制数字', () => {
      const context = createInitialContext()
      const result = matchToken('0x1F', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('0x1F')
      expect(result!.token.scope).toBe('constant.numeric.js')
    })
  })

  describe('字符串', () => {
    test('双引号字符串', () => {
      const context = createInitialContext()
      const result = matchToken('"hello"', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('"')
      expect(result!.token.scope).toBe('string.quoted.double.js')
      expect(result!.newContext.stateStack).toEqual(['global', 'string-double'])
    })

    test('单引号字符串', () => {
      const context = createInitialContext()
      const result = matchToken("'world'", context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe("'")
      expect(result!.token.scope).toBe('string.quoted.single.js')
      expect(result!.newContext.stateStack).toEqual(['global', 'string-single'])
    })

    test('模板字符串', () => {
      const context = createInitialContext()
      const result = matchToken('`template`', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('`')
      expect(result!.token.scope).toBe('string.quoted.backtick.js')
      expect(result!.newContext.stateStack).toEqual(['global', 'string-backtick'])
    })
  })

  describe('标识符', () => {
    test('普通标识符', () => {
      const context = createInitialContext()
      const result = matchToken('variableName', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('variableName')
      expect(result!.token.scope).toBe('variable.identifier.js')
    })

    test('带下划线的标识符', () => {
      const context = createInitialContext()
      const result = matchToken('_privateVar', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('_privateVar')
      expect(result!.token.scope).toBe('variable.identifier.js')
    })

    test('带美元符号的标识符', () => {
      const context = createInitialContext()
      const result = matchToken('$jquery', context)
      
      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('$jquery')
      expect(result!.token.scope).toBe('variable.identifier.js')
    })
  })
})
