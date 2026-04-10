import { test, expect, describe } from 'bun:test'
import { matchToken, createInitialContext, pushState } from '../engine'

describe('字符串状态规则测试', () => {
  describe('string-double 状态', () => {
    test('简单字符串', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-double')

      const result = matchToken('hello"', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('hello"')
      expect(result!.token.scope).toBe('string.quoted.double.js')
      expect(result!.newContext.stateStack).toEqual(['global'])
    })

    test('带转义的字符串', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-double')

      const result = matchToken('hello\\"world"', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('hello\\"world"')
      expect(result!.token.scope).toBe('string.quoted.double.js')
      expect(result!.newContext.stateStack).toEqual(['global'])
    })

    test('未闭合的字符串', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-double')

      const result = matchToken('hello world', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('hello world')
      expect(result!.token.scope).toBe('string.quoted.double.js')
      expect(result!.newContext.stateStack).toEqual(['global', 'string-double'])
    })
  })

  describe('string-single 状态', () => {
    test('简单字符串', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-single')

      const result = matchToken("hello'", context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe("hello'")
      expect(result!.token.scope).toBe('string.quoted.single.js')
      expect(result!.newContext.stateStack).toEqual(['global'])
    })

    test('带转义的字符串', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-single')

      const result = matchToken("hello\\'world'", context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe("hello\\'world'")
      expect(result!.token.scope).toBe('string.quoted.single.js')
      expect(result!.newContext.stateStack).toEqual(['global'])
    })

    test('未闭合的字符串', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-single')

      const result = matchToken('hello world', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('hello world')
      expect(result!.token.scope).toBe('string.quoted.single.js')
      expect(result!.newContext.stateStack).toEqual(['global', 'string-single'])
    })
  })

  describe('string-backtick 状态', () => {
    test('简单模板字符串', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-backtick')

      const result = matchToken('hello`', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('hello')
      expect(result!.token.scope).toBe('string.quoted.backtick.js')
    })

    test('模板字符串结束', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-backtick')

      const result = matchToken('`', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('`')
      expect(result!.token.scope).toBe('string.quoted.backtick.js')
      expect(result!.newContext.stateStack).toEqual(['global'])
    })

    test('模板插值开始', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-backtick')

      const result = matchToken('${variable}`', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('${')
      expect(result!.token.scope).toBe(
        'punctuation.definition.template-expression.js'
      )
      expect(result!.newContext.stateStack).toEqual([
        'global',
        'string-backtick',
        'template-interpolation'
      ])
    })

    test('转义字符', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-backtick')

      const result = matchToken('\\n`', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('\\n')
      expect(result!.token.scope).toBe('string.quoted.backtick.js')
    })

    test('单独的 $ 符号', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-backtick')

      const result = matchToken('$100`', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('$')
      expect(result!.token.scope).toBe('string.quoted.backtick.js')
    })
  })

  describe('template-interpolation 状态', () => {
    test('插值结束', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-backtick')
      context = pushState(context, 'template-interpolation')

      const result = matchToken('}`', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('}')
      expect(result!.token.scope).toBe(
        'punctuation.definition.template-expression.js'
      )
      expect(result!.newContext.stateStack).toEqual([
        'global',
        'string-backtick'
      ])
    })

    test('插值中的关键字', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-backtick')
      context = pushState(context, 'template-interpolation')

      const result = matchToken('const x = 1}', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('const')
      expect(result!.token.scope).toBe('keyword.control.js')
    })

    test('插值中的标识符', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-backtick')
      context = pushState(context, 'template-interpolation')

      const result = matchToken('variableName}', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('variableName')
      expect(result!.token.scope).toBe('variable.identifier.js')
    })

    test('插值中的数字', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-backtick')
      context = pushState(context, 'template-interpolation')

      const result = matchToken('123}', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('123')
      expect(result!.token.scope).toBe('constant.numeric.js')
    })

    test('插值中的嵌套字符串', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-backtick')
      context = pushState(context, 'template-interpolation')

      const result = matchToken('"nested"}', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('"')
      expect(result!.token.scope).toBe('string.quoted.double.js')
      expect(result!.newContext.stateStack).toEqual([
        'global',
        'string-backtick',
        'template-interpolation',
        'string-double'
      ])
    })
  })
})
