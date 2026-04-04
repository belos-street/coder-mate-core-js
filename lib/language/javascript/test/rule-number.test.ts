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

describe('grammarRules - 数字字面量 - 基础', () => {
  it('should match integer', () => {
    const result = matchToken('42')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('42')
  })

  it('should match decimal', () => {
    const result = matchToken('3.14')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('3.14')
  })

  it('should match zero', () => {
    const result = matchToken('0')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0')
  })
})

describe('grammarRules - 数字字面量 - 二进制', () => {
  it('should match binary with 0b prefix', () => {
    const result = matchToken('0b1010')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0b1010')
  })

  it('should match binary with 0B prefix', () => {
    const result = matchToken('0B1010')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0B1010')
  })

  it('should match binary with underscores', () => {
    const result = matchToken('0b1010_0101')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0b1010_0101')
  })

  it('should match binary with multiple underscores', () => {
    const result = matchToken('0b1010_0011_0101')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0b1010_0011_0101')
  })
})

describe('grammarRules - 数字字面量 - 八进制', () => {
  it('should match octal with 0o prefix', () => {
    const result = matchToken('0o755')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0o755')
  })

  it('should match octal with 0O prefix', () => {
    const result = matchToken('0O755')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0O755')
  })

  it('should match octal with underscores', () => {
    const result = matchToken('0o1_234')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0o1_234')
  })
})

describe('grammarRules - 数字字面量 - 十六进制', () => {
  it('should match hex with 0x prefix', () => {
    const result = matchToken('0xFF')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0xFF')
  })

  it('should match hex with 0X prefix', () => {
    const result = matchToken('0XFF')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0XFF')
  })

  it('should match hex with lowercase letters', () => {
    const result = matchToken('0xabcdef')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0xabcdef')
  })

  it('should match hex with mixed case', () => {
    const result = matchToken('0xAbCdEf')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0xAbCdEf')
  })

  it('should match hex with underscores', () => {
    const result = matchToken('0xDEAD_BEEF')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0xDEAD_BEEF')
  })

  it('should match hex color format', () => {
    const result = matchToken('0xFF0000')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0xFF0000')
  })
})

describe('grammarRules - 数字字面量 - BigInt', () => {
  it('should match BigInt with n suffix', () => {
    const result = matchToken('123n')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('123n')
  })

  it('should match BigInt with underscores', () => {
    const result = matchToken('1_000_000n')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('1_000_000n')
  })

  it('should match binary BigInt', () => {
    const result = matchToken('0b1010n')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0b1010n')
  })

  it('should match octal BigInt', () => {
    const result = matchToken('0o755n')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0o755n')
  })

  it('should match hex BigInt', () => {
    const result = matchToken('0xFFn')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0xFFn')
  })

  it('should match large BigInt', () => {
    const result = matchToken('9007199254740991n')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('9007199254740991n')
  })
})

describe('grammarRules - 数字字面量 - 数字分隔符', () => {
  it('should match integer with underscores', () => {
    const result = matchToken('1_000_000')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('1_000_000')
  })

  it('should match decimal with underscores', () => {
    const result = matchToken('3.141_592_653')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('3.141_592_653')
  })

  it('should match large number with underscores', () => {
    const result = matchToken('10_000_000_000')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('10_000_000_000')
  })
})

describe('grammarRules - 数字字面量 - 科学计数法', () => {
  it('should match scientific notation with positive exponent', () => {
    const result = matchToken('1e10')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('1e10')
  })

  it('should match scientific notation with negative exponent', () => {
    const result = matchToken('1e-5')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('1e-5')
  })

  it('should match scientific notation with positive sign', () => {
    const result = matchToken('1e+10')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('1e+10')
  })

  it('should match decimal with scientific notation', () => {
    const result = matchToken('3.14e10')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('3.14e10')
  })

  it('should match decimal with negative exponent', () => {
    const result = matchToken('1.5e-3')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('1.5e-3')
  })

  it('should match scientific notation with uppercase E', () => {
    const result = matchToken('1E10')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('1E10')
  })

  it('should match scientific notation with underscores', () => {
    const result = matchToken('1e1_000')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('1e1_000')
  })
})
