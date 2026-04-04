import { describe, it, expect } from 'bun:test'
import { generateJavaScriptTokens } from '../main'

describe('generateJavaScriptTokens - 数字字面量集成测试', () => {
  it('should tokenize various number formats', () => {
    const code = `
const a = 42;
const b = 3.14;
const c = 0b1010;
const d = 0o755;
const e = 0xFF;
const f = 123n;
const g = 1_000_000;
const h = 1.5e-3;
`
    const tokens = generateJavaScriptTokens(code)

    const numberTokens = tokens
      .flat()
      .filter(token => token.type === 'token-number')
      .map(token => token.value)

    expect(numberTokens).toContain('42')
    expect(numberTokens).toContain('3.14')
    expect(numberTokens).toContain('0b1010')
    expect(numberTokens).toContain('0o755')
    expect(numberTokens).toContain('0xFF')
    expect(numberTokens).toContain('123n')
    expect(numberTokens).toContain('1_000_000')
    expect(numberTokens).toContain('1.5e-3')
  })

  it('should tokenize BigInt with different bases', () => {
    const code = `
const binary = 0b1010n;
const octal = 0o755n;
const hex = 0xFFn;
`
    const tokens = generateJavaScriptTokens(code)

    const numberTokens = tokens
      .flat()
      .filter(token => token.type === 'token-number')
      .map(token => token.value)

    expect(numberTokens).toContain('0b1010n')
    expect(numberTokens).toContain('0o755n')
    expect(numberTokens).toContain('0xFFn')
  })

  it('should tokenize numbers with underscores in various positions', () => {
    const code = `
const a = 1_000_000;
const b = 0xDEAD_BEEF;
const c = 0b1010_0011;
`
    const tokens = generateJavaScriptTokens(code)

    const numberTokens = tokens
      .flat()
      .filter(token => token.type === 'token-number')
      .map(token => token.value)

    expect(numberTokens).toContain('1_000_000')
    expect(numberTokens).toContain('0xDEAD_BEEF')
    expect(numberTokens).toContain('0b1010_0011')
  })

  it('should tokenize scientific notation correctly', () => {
    const code = `
const a = 1e10;
const b = 1e-5;
const c = 1.5e+10;
const d = 3.14E-3;
`
    const tokens = generateJavaScriptTokens(code)

    const numberTokens = tokens
      .flat()
      .filter(token => token.type === 'token-number')
      .map(token => token.value)

    expect(numberTokens).toContain('1e10')
    expect(numberTokens).toContain('1e-5')
    expect(numberTokens).toContain('1.5e+10')
    expect(numberTokens).toContain('3.14E-3')
  })

  it('should handle real-world JavaScript code with numbers', () => {
    const code = `
const MAX_SIZE = 1024 * 1024;
const buffer = new ArrayBuffer(0x10000);
const mask = 0b11111111_00000000;
const largeNumber = 9_007_199_254_740_991n;
`
    const tokens = generateJavaScriptTokens(code)

    const numberTokens = tokens
      .flat()
      .filter(token => token.type === 'token-number')
      .map(token => token.value)

    expect(numberTokens).toContain('1024')
    expect(numberTokens).toContain('1024')
    expect(numberTokens).toContain('0x10000')
    expect(numberTokens).toContain('0b11111111_00000000')
    expect(numberTokens).toContain('9_007_199_254_740_991n')
  })
})
