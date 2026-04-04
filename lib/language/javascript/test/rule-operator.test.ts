import { describe, it, expect } from 'bun:test'
import { grammarRules } from '../rule'
import { TokenType, GrammarState } from '../type'

function matchToken(
  code: string,
  pos: number = 0
): { token: string; value: string } | null {
  const rules = grammarRules[GrammarState.Initial]
  for (const rule of rules) {
    rule.regex.lastIndex = pos
    const match = rule.regex.exec(code)
    if (match && match.index === pos) {
      return { token: rule.token!, value: match[1] || match[0] }
    }
  }
  return null
}

describe('grammarRules - 运算符 - 单字符', () => {
  const operators = [
    { char: '+', name: '加' },
    { char: '-', name: '减' },
    { char: '*', name: '乘' },
    { char: '/', name: '除' },
    { char: '%', name: '取模' },
    { char: '=', name: '赋值' },
    { char: '<', name: '小于' },
    { char: '>', name: '大于' },
    { char: '!', name: '逻辑非' },
    { char: '&', name: '按位与' },
    { char: '|', name: '按位或' },
    { char: '^', name: '按位异或' },
    { char: '~', name: '按位非' },
    { char: '?', name: '三元运算符' },
    { char: ':', name: '冒号' },
    { char: '@', name: '装饰器' }
  ]

  for (const op of operators) {
    it(`should match operator: ${op.name} (${op.char})`, () => {
      const result = matchToken(op.char)
      expect(result?.token).toBe(TokenType.Operator)
      expect(result?.value).toBe(op.char)
    })
  }
})

describe('grammarRules - 运算符 - 两字符', () => {
  const operators = [
    { char: '==', name: '相等' },
    { char: '!=', name: '不等' },
    { char: '===', name: '全等' },
    { char: '!==', name: '不全等' },
    { char: '<=', name: '小于等于' },
    { char: '>=', name: '大于等于' },
    { char: '&&', name: '逻辑与' },
    { char: '||', name: '逻辑或' },
    { char: '??', name: '空值合并' },
    { char: '?.', name: '可选链' },
    { char: '++', name: '递增' },
    { char: '--', name: '递减' },
    { char: '**', name: '幂运算' },
    { char: '<<', name: '左移' },
    { char: '>>', name: '右移' },
    { char: '>>>', name: '无符号右移' },
    { char: '=>', name: '箭头函数' },
    { char: '...', name: '展开运算符' },
    { char: '+=', name: '加赋值' },
    { char: '-=', name: '减赋值' },
    { char: '*=', name: '乘赋值' },
    { char: '/=', name: '除赋值' },
    { char: '%=', name: '取模赋值' },
    { char: '&=', name: '按位与赋值' },
    { char: '|=', name: '按位或赋值' },
    { char: '^=', name: '按位异或赋值' },
    { char: '<<=', name: '左移赋值' },
    { char: '>>=', name: '右移赋值' },
    { char: '&&=', name: '逻辑与赋值' },
    { char: '||=', name: '逻辑或赋值' },
    { char: '??=', name: '空值合并赋值' }
  ]

  for (const op of operators) {
    it(`should match operator: ${op.name} (${op.char})`, () => {
      const result = matchToken(op.char)
      expect(result?.token).toBe(TokenType.Operator)
      expect(result?.value).toBe(op.char)
    })
  }
})

describe('grammarRules - 运算符 - 三字符', () => {
  it('should match unsigned right shift assignment (>>>=)', () => {
    const result = matchToken('>>>=')
    expect(result?.token).toBe(TokenType.Operator)
    expect(result?.value).toBe('>>>=')
  })
})

describe('grammarRules - 运算符 - 组合使用', () => {
  it('should distinguish == and ===', () => {
    const result1 = matchToken('==')
    const result2 = matchToken('===')

    expect(result1?.value).toBe('==')
    expect(result2?.value).toBe('===')
    expect(result1?.value).not.toBe(result2?.value)
  })

  it('should distinguish | and ||', () => {
    const result1 = matchToken('|')
    const result2 = matchToken('||')

    expect(result1?.value).toBe('|')
    expect(result2?.value).toBe('||')
    expect(result1?.value).not.toBe(result2?.value)
  })

  it('should distinguish ? and ??', () => {
    const result1 = matchToken('?')
    const result2 = matchToken('??')

    expect(result1?.value).toBe('?')
    expect(result2?.value).toBe('??')
    expect(result1?.value).not.toBe(result2?.value)
  })

  it('should distinguish . and ...', () => {
    const result1 = matchToken('.')
    const result2 = matchToken('...')

    expect(result1?.value).toBe('.')
    expect(result2?.value).toBe('...')
    expect(result1?.value).not.toBe(result2?.value)
  })
})

describe('grammarRules - 标点符号', () => {
  const punctuations = [
    { char: ';', name: '分号' },
    { char: ',', name: '逗号' },
    { char: '(', name: '左括号' },
    { char: ')', name: '右括号' },
    { char: '{', name: '左花括号' },
    { char: '}', name: '右花括号' },
    { char: '[', name: '左方括号' },
    { char: ']', name: '右方括号' }
  ]

  for (const punct of punctuations) {
    it(`should match punctuation: ${punct.name} (${punct.char})`, () => {
      const result = matchToken(punct.char)
      expect(result?.token).toBe(TokenType.Punctuation)
      expect(result?.value).toBe(punct.char)
    })
  }
})
