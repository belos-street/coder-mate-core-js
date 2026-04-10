import { test, expect, describe } from 'bun:test'
import { matchToken, createInitialContext, pushState } from '../engine'

describe('特殊状态规则测试', () => {
  describe('multiline-comment 状态', () => {
    test('多行注释结束', () => {
      let context = createInitialContext()
      context = pushState(context, 'multiline-comment')

      const result = matchToken('comment*/', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('comment*/')
      expect(result!.token.scope).toBe('comment.block.js')
      expect(result!.newContext.stateStack).toEqual(['global'])
    })

    test('多行注释跨行', () => {
      let context = createInitialContext()
      context = pushState(context, 'multiline-comment')

      const result = matchToken('line1\nline2*/', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('line1\nline2*/')
      expect(result!.token.scope).toBe('comment.block.js')
      expect(result!.newContext.stateStack).toEqual(['global'])
    })

    test('未闭合的多行注释', () => {
      let context = createInitialContext()
      context = pushState(context, 'multiline-comment')

      const result = matchToken('comment without end', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('comment without end')
      expect(result!.token.scope).toBe('comment.block.js')
      expect(result!.newContext.stateStack).toEqual([
        'global',
        'multiline-comment'
      ])
    })
  })

  describe('import-dynamic 状态', () => {
    test('动态导入结束', () => {
      let context = createInitialContext()
      context = pushState(context, 'import-dynamic')

      const result = matchToken(')', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe(')')
      expect(result!.token.scope).toBe('operator.js')
      expect(result!.newContext.stateStack).toEqual(['global'])
    })

    test('动态导入字符串路径（双引号）', () => {
      let context = createInitialContext()
      context = pushState(context, 'import-dynamic')

      const result = matchToken('"./module.js")', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('"')
      expect(result!.token.scope).toBe('string.quoted.double.js')
      expect(result!.newContext.stateStack).toEqual([
        'global',
        'import-dynamic',
        'string-double'
      ])
    })

    test('动态导入字符串路径（单引号）', () => {
      let context = createInitialContext()
      context = pushState(context, 'import-dynamic')

      const result = matchToken("'./module.js')", context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe("'")
      expect(result!.token.scope).toBe('string.quoted.single.js')
      expect(result!.newContext.stateStack).toEqual([
        'global',
        'import-dynamic',
        'string-single'
      ])
    })

    test('动态导入变量', () => {
      let context = createInitialContext()
      context = pushState(context, 'import-dynamic')

      const result = matchToken('modulePath)', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('modulePath')
      expect(result!.token.scope).toBe('variable.identifier.js')
    })

    test('动态导入运算符', () => {
      let context = createInitialContext()
      context = pushState(context, 'import-dynamic')

      const result = matchToken('+ path)', context)

      expect(result).not.toBeNull()
      expect(result!.token.text).toBe('+')
      expect(result!.token.scope).toBe('operator.js')
    })
  })

  describe('状态切换逻辑', () => {
    test('global → multiline-comment', () => {
      const context = createInitialContext()
      const result = matchToken('/* comment */', context)

      expect(result).not.toBeNull()
      expect(result!.newContext.stateStack).toEqual([
        'global',
        'multiline-comment'
      ])
    })

    test('global → string-double', () => {
      const context = createInitialContext()
      const result = matchToken('"string"', context)

      expect(result).not.toBeNull()
      expect(result!.newContext.stateStack).toEqual(['global', 'string-double'])
    })

    test('global → string-single', () => {
      const context = createInitialContext()
      const result = matchToken("'string'", context)

      expect(result).not.toBeNull()
      expect(result!.newContext.stateStack).toEqual(['global', 'string-single'])
    })

    test('global → string-backtick', () => {
      const context = createInitialContext()
      const result = matchToken('`template`', context)

      expect(result).not.toBeNull()
      expect(result!.newContext.stateStack).toEqual([
        'global',
        'string-backtick'
      ])
    })

    test('global → import-dynamic', () => {
      const context = createInitialContext()
      const result = matchToken('import("./module.js")', context)

      expect(result).not.toBeNull()
      expect(result!.newContext.stateStack).toEqual([
        'global',
        'import-dynamic'
      ])
    })

    test('string-backtick → template-interpolation', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-backtick')
      const result = matchToken('${variable}`', context)

      expect(result).not.toBeNull()
      expect(result!.newContext.stateStack).toEqual([
        'global',
        'string-backtick',
        'template-interpolation'
      ])
    })

    test('multiline-comment → global (popState)', () => {
      let context = createInitialContext()
      context = pushState(context, 'multiline-comment')
      const result = matchToken('*/', context)

      expect(result).not.toBeNull()
      expect(result!.newContext.stateStack).toEqual(['global'])
    })

    test('string-double → global (popState)', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-double')
      const result = matchToken('string"', context)

      expect(result).not.toBeNull()
      expect(result!.newContext.stateStack).toEqual(['global'])
    })

    test('string-single → global (popState)', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-single')
      const result = matchToken("string'", context)

      expect(result).not.toBeNull()
      expect(result!.newContext.stateStack).toEqual(['global'])
    })

    test('string-backtick → global (popState)', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-backtick')
      const result = matchToken('`', context)

      expect(result).not.toBeNull()
      expect(result!.newContext.stateStack).toEqual(['global'])
    })

    test('template-interpolation → string-backtick (popState)', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-backtick')
      context = pushState(context, 'template-interpolation')
      const result = matchToken('}`', context)

      expect(result).not.toBeNull()
      expect(result!.newContext.stateStack).toEqual([
        'global',
        'string-backtick'
      ])
    })

    test('import-dynamic → global (popState)', () => {
      let context = createInitialContext()
      context = pushState(context, 'import-dynamic')
      const result = matchToken(')', context)

      expect(result).not.toBeNull()
      expect(result!.newContext.stateStack).toEqual(['global'])
    })
  })
})
