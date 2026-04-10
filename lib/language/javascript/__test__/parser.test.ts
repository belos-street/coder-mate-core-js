import { test, expect, describe } from 'bun:test'
import {
  createInitialContext,
  pushState,
  popState,
  getCurrentState,
  splitTokenByLineBreak,
  matchToken
} from '../engine'
import { parse } from '../index'
import { highlightJavaScript as highlight } from '../../../../src/render'

describe('解析引擎测试', () => {
  describe('状态栈管理', () => {
    test('createInitialContext - 创建初始上下文', () => {
      const context = createInitialContext()

      expect(context.stateStack).toEqual(['global'])
      expect(context.line).toBe(1)
      expect(context.col).toBe(1)
    })

    test('pushState - 压栈', () => {
      const context = createInitialContext()
      const newContext = pushState(context, 'string-double')

      expect(newContext.stateStack).toEqual(['global', 'string-double'])
      expect(context.stateStack).toEqual(['global']) // 原上下文不变
    })

    test('popState - 弹栈', () => {
      let context = createInitialContext()
      context = pushState(context, 'string-double')
      const newContext = popState(context)

      expect(newContext.stateStack).toEqual(['global'])
      expect(context.stateStack).toEqual(['global', 'string-double']) // 原上下文不变
    })

    test('popState - 弹出最后一个状态抛出错误', () => {
      const context = createInitialContext()

      expect(() => popState(context)).toThrow(
        'Cannot pop the last state from stack'
      )
    })

    test('getCurrentState - 获取当前状态', () => {
      let context = createInitialContext()
      expect(getCurrentState(context)).toBe('global')

      context = pushState(context, 'string-double')
      expect(getCurrentState(context)).toBe('string-double')

      context = pushState(context, 'template-interpolation')
      expect(getCurrentState(context)).toBe('template-interpolation')
    })

    test('状态栈不可变性', () => {
      const context1 = createInitialContext()
      const context2 = pushState(context1, 'string-double')
      const context3 = pushState(context2, 'template-interpolation')

      expect(context1.stateStack).toEqual(['global'])
      expect(context2.stateStack).toEqual(['global', 'string-double'])
      expect(context3.stateStack).toEqual([
        'global',
        'string-double',
        'template-interpolation'
      ])
    })
  })

  describe('行列追踪', () => {
    test('matchToken - 初始行列', () => {
      const context = createInitialContext()
      const result = matchToken('const x = 1;', context)

      expect(result).not.toBeNull()
      expect(result!.token.line).toBe(1)
      expect(result!.token.col).toEqual([1, 5]) // 'const' 占 5 个字符
    })

    test('matchToken - 更新列号', () => {
      const context = createInitialContext()
      const result1 = matchToken('const x = 1;', context)

      expect(result1).not.toBeNull()
      expect(result1!.newContext.col).toBe(6) // 列号推进到 6

      const result2 = matchToken(' x = 1;', result1!.newContext)
      expect(result2).not.toBeNull()
      expect(result2!.token.text).toBe(' ')
      expect(result2!.token.col).toEqual([6, 6])
    })

    test('parse - 多行代码的行列追踪', () => {
      const code = 'const x = 1;\nlet y = 2;'
      const tokens = parse(code)

      expect(tokens.length).toBe(2) // 两行

      // 第一行
      expect(tokens[0]![0]!.line).toBe(1)
      expect(tokens[0]![0]!.col[0]).toBe(1)

      // 第二行
      expect(tokens[1]![0]!.line).toBe(2)
      expect(tokens[1]![0]!.col[0]).toBe(1)
    })

    test('parse - 换行符的行列', () => {
      const code = 'x\ny'
      const tokens = parse(code)

      expect(tokens.length).toBe(2)

      // 第一行：x + 换行符
      expect(tokens[0]!.length).toBe(2)
      expect(tokens[0]![0]!.text).toBe('x')
      expect(tokens[0]![0]!.line).toBe(1)
      expect(tokens[0]![0]!.col).toEqual([1, 1])

      expect(tokens[0]![1]!.text).toBe('\n')
      expect(tokens[0]![1]!.line).toBe(1)
      expect(tokens[0]![1]!.col).toEqual([2, 2])

      // 第二行：y
      expect(tokens[1]!.length).toBe(1)
      expect(tokens[1]![0]!.text).toBe('y')
      expect(tokens[1]![0]!.line).toBe(2)
      expect(tokens[1]![0]!.col).toEqual([1, 1])
    })

    test('parse - 跨行注释后续 token 行号连续', () => {
      const code = '/*a\nb*/\nconst x = 1;'
      const tokens = parse(code)

      expect(tokens.length).toBe(3)

      // 第二行末尾换行符应在第 2 行
      const secondLineBreak = tokens[1]!.find((t) => t.text === '\n')
      expect(secondLineBreak).toBeDefined()
      expect(secondLineBreak!.line).toBe(2)

      // 第三行首个 token 应在第 3 行
      const thirdLineFirstToken = tokens[2]![0]
      expect(thirdLineFirstToken).toBeDefined()
      expect(thirdLineFirstToken!.text).toBe('const')
      expect(thirdLineFirstToken!.line).toBe(3)
      expect(thirdLineFirstToken!.col[0]).toBe(1)
    })
  })

  describe('跨行 token 拆分', () => {
    test('splitTokenByLineBreak - 单行文本', () => {
      const tokens = splitTokenByLineBreak(
        'hello',
        'string.quoted.double.js',
        1,
        1
      )

      expect(tokens.length).toBe(1)
      expect(tokens[0]!.text).toBe('hello')
      expect(tokens[0]!.line).toBe(1)
      expect(tokens[0]!.col).toEqual([1, 5])
    })

    test('splitTokenByLineBreak - 包含 LF 换行符', () => {
      const tokens = splitTokenByLineBreak(
        'hello\nworld',
        'string.quoted.double.js',
        1,
        1
      )

      expect(tokens.length).toBe(3)

      // hello
      expect(tokens[0]!.text).toBe('hello')
      expect(tokens[0]!.line).toBe(1)
      expect(tokens[0]!.col).toEqual([1, 5])

      // \n
      expect(tokens[1]!.text).toBe('\n')
      expect(tokens[1]!.line).toBe(1)
      expect(tokens[1]!.col).toEqual([6, 6])

      // world
      expect(tokens[2]!.text).toBe('world')
      expect(tokens[2]!.line).toBe(2)
      expect(tokens[2]!.col).toEqual([1, 5])
    })

    test('splitTokenByLineBreak - 包含 CRLF 换行符', () => {
      const tokens = splitTokenByLineBreak(
        'hello\r\nworld',
        'string.quoted.double.js',
        1,
        1
      )

      expect(tokens.length).toBe(3)

      // hello
      expect(tokens[0]!.text).toBe('hello')
      expect(tokens[0]!.line).toBe(1)
      expect(tokens[0]!.col).toEqual([1, 5])

      // \r\n
      expect(tokens[1]!.text).toBe('\r\n')
      expect(tokens[1]!.line).toBe(1)
      expect(tokens[1]!.col).toEqual([6, 7])

      // world
      expect(tokens[2]!.text).toBe('world')
      expect(tokens[2]!.line).toBe(2)
      expect(tokens[2]!.col).toEqual([1, 5])
    })

    test('splitTokenByLineBreak - 多个换行符', () => {
      const tokens = splitTokenByLineBreak(
        'a\nb\nc',
        'string.quoted.double.js',
        1,
        1
      )

      expect(tokens.length).toBe(5)

      expect(tokens[0]!.text).toBe('a')
      expect(tokens[0]!.line).toBe(1)

      expect(tokens[1]!.text).toBe('\n')
      expect(tokens[1]!.line).toBe(1)

      expect(tokens[2]!.text).toBe('b')
      expect(tokens[2]!.line).toBe(2)

      expect(tokens[3]!.text).toBe('\n')
      expect(tokens[3]!.line).toBe(2)

      expect(tokens[4]!.text).toBe('c')
      expect(tokens[4]!.line).toBe(3)
    })

    test('splitTokenByLineBreak - 以换行符开头', () => {
      const tokens = splitTokenByLineBreak(
        '\nhello',
        'string.quoted.double.js',
        1,
        1
      )

      expect(tokens.length).toBe(2)

      expect(tokens[0]!.text).toBe('\n')
      expect(tokens[0]!.line).toBe(1)
      expect(tokens[0]!.col).toEqual([1, 1])

      expect(tokens[1]!.text).toBe('hello')
      expect(tokens[1]!.line).toBe(2)
      expect(tokens[1]!.col).toEqual([1, 5])
    })

    test('splitTokenByLineBreak - 以换行符结尾', () => {
      const tokens = splitTokenByLineBreak(
        'hello\n',
        'string.quoted.double.js',
        1,
        1
      )

      expect(tokens.length).toBe(2)

      expect(tokens[0]!.text).toBe('hello')
      expect(tokens[0]!.line).toBe(1)
      expect(tokens[0]!.col).toEqual([1, 5])

      expect(tokens[1]!.text).toBe('\n')
      expect(tokens[1]!.line).toBe(1)
      expect(tokens[1]!.col).toEqual([6, 6])
    })
  })

  describe('parse 函数', () => {
    test('parse - 简单代码', () => {
      const tokens = parse('const x = 1;')

      expect(tokens.length).toBe(1)
      expect(tokens[0]!.length).toBeGreaterThan(0)
    })

    test('parse - 空字符串', () => {
      const tokens = parse('')

      expect(tokens.length).toBe(0)
    })

    test('parse - 只有换行符', () => {
      const tokens = parse('\n\n')

      expect(tokens.length).toBe(2) // 两个换行符，每个一行
      expect(tokens[0]!.length).toBe(1) // 第一行：一个换行符 token
      expect(tokens[1]!.length).toBe(1) // 第二行：一个换行符 token
    })

    test('parse - 多行注释', () => {
      const code = `/* line1
line2
line3 */`
      const tokens = parse(code)

      expect(tokens.length).toBe(3) // 三行
    })

    test('parse - 模板字符串', () => {
      const code = '`hello ${name} world`'
      const tokens = parse(code)

      expect(tokens.length).toBe(1)

      // 检查模板插值
      const interpolationTokens = tokens[0]!.filter(
        (t) => t.scope === 'punctuation.definition.template-expression.js'
      )
      expect(interpolationTokens.length).toBe(2) // ${ 和 }
    })

    test('parse - 动态导入', () => {
      const code = 'import("./module.js")'
      const tokens = parse(code)

      expect(tokens.length).toBe(1)

      // 检查 import(
      const importToken = tokens[0]!.find(
        (t) => t.scope === 'keyword.control.import.js'
      )
      expect(importToken).toBeDefined()

      // 检查 )
      const closeParen = tokens[0]!.filter((t) => t.text === ')')
      expect(closeParen.length).toBeGreaterThan(0)
    })

    test('parse - 复杂代码', () => {
      const code = `
const x = 1;
let y = 2;

function add(a, b) {
  return a + b;
}

const result = add(x, y);
`
      const tokens = parse(code)

      expect(tokens.length).toBeGreaterThan(0)

      // 检查所有 token 都有正确的行列信息
      tokens.forEach((row, lineIndex) => {
        row.forEach((token) => {
          expect(token.line).toBeGreaterThanOrEqual(1)
          expect(token.col[0]).toBeGreaterThanOrEqual(1)
          expect(token.col[1]).toBeGreaterThanOrEqual(token.col[0])
        })
      })
    })
  })

  describe('highlight 函数', () => {
    test('highlight - 生成 HTML', () => {
      const html = highlight('const x = 1;')

      expect(html).toContain('<pre')
      expect(html).toContain('<code>')
      expect(html).toContain('<span')
      expect(html).toContain('style=')
    })

    test('highlight - 包含样式', () => {
      const html = highlight('const')

      expect(html).toContain('color:')
      expect(html).toContain('#569CD6') // 关键字颜色
    })

    test('highlight - HTML 转义', () => {
      const html = highlight('const x = "<div>";')

      expect(html).toContain('&lt;')
      expect(html).toContain('&gt;')
      expect(html).not.toContain('<div>')
    })

    test('highlight - 多行代码', () => {
      const html = highlight('const x = 1;\nlet y = 2;')

      expect(html).toContain('line-1')
      expect(html).toContain('line-2')
    })

    test('highlight - 空字符串', () => {
      const html = highlight('')

      expect(html).toContain('<pre')
      expect(html).toContain('<code>')
      expect(html).toContain('</code>')
      expect(html).toContain('</pre>')
    })

    test('highlight - ES2020 特性', () => {
      const html = highlight('const x = obj?.property ?? "default"')

      // 检查可选链和空值合并的样式
      expect(html).toContain('#DCDCAA') // 可选链和空值合并的颜色
      expect(html).toContain('font-weight: bold') // 可选链和空值合并的粗体
    })
  })
})
