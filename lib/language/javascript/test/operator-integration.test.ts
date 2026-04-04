import { describe, it, expect } from 'bun:test'
import { generateJavaScriptTokens } from '../main'

describe('generateJavaScriptTokens - 运算符集成测试', () => {
  it('should tokenize comparison operators', () => {
    const code = `
if (a === b && c !== d) {
  return x >= y || z < w;
}
`
    const tokens = generateJavaScriptTokens(code)

    const operatorTokens = tokens
      .flat()
      .filter(token => token.type === 'token-operator')
      .map(token => token.value)

    expect(operatorTokens).toContain('===')
    expect(operatorTokens).toContain('!==')
    expect(operatorTokens).toContain('>=')
    expect(operatorTokens).toContain('<')
  })

  it('should tokenize logical operators', () => {
    const code = `
const result = a && b || c ?? d;
`
    const tokens = generateJavaScriptTokens(code)

    const operatorTokens = tokens
      .flat()
      .filter(token => token.type === 'token-operator')
      .map(token => token.value)

    expect(operatorTokens).toContain('&&')
    expect(operatorTokens).toContain('||')
    expect(operatorTokens).toContain('??')
  })

  it('should tokenize optional chaining', () => {
    const code = `
const value = obj?.prop?.method?.();
`
    const tokens = generateJavaScriptTokens(code)

    const operatorTokens = tokens
      .flat()
      .filter(token => token.type === 'token-operator')
      .map(token => token.value)

    expect(operatorTokens).toContain('?.')
  })

  it('should tokenize arrow function', () => {
    const code = `
const fn = (x, y) => x + y;
`
    const tokens = generateJavaScriptTokens(code)

    const operatorTokens = tokens
      .flat()
      .filter(token => token.type === 'token-operator')
      .map(token => token.value)

    expect(operatorTokens).toContain('=>')
  })

  it('should tokenize spread operator', () => {
    const code = `
const arr = [...list1, ...list2];
const obj = { ...obj1, ...obj2 };
`
    const tokens = generateJavaScriptTokens(code)

    const operatorTokens = tokens
      .flat()
      .filter(token => token.type === 'token-operator')
      .map(token => token.value)

    expect(operatorTokens).toContain('...')
  })

  it('should tokenize assignment operators', () => {
    const code = `
a += b;
c -= d;
e *= f;
g /= h;
`
    const tokens = generateJavaScriptTokens(code)

    const operatorTokens = tokens
      .flat()
      .filter(token => token.type === 'token-operator')
      .map(token => token.value)

    expect(operatorTokens).toContain('+=')
    expect(operatorTokens).toContain('-=')
    expect(operatorTokens).toContain('*=')
    expect(operatorTokens).toContain('/=')
  })

  it('should tokenize bitwise operators', () => {
    const code = `
const a = x & y | z ^ w;
const b = ~x << 2 >> 1;
`
    const tokens = generateJavaScriptTokens(code)

    const operatorTokens = tokens
      .flat()
      .filter(token => token.type === 'token-operator')
      .map(token => token.value)

    expect(operatorTokens).toContain('&')
    expect(operatorTokens).toContain('|')
    expect(operatorTokens).toContain('^')
    expect(operatorTokens).toContain('~')
    expect(operatorTokens).toContain('<<')
    expect(operatorTokens).toContain('>>')
  })

  it('should tokenize nullish coalescing assignment', () => {
    const code = `
obj.prop ??= defaultValue;
`
    const tokens = generateJavaScriptTokens(code)

    const operatorTokens = tokens
      .flat()
      .filter(token => token.type === 'token-operator')
      .map(token => token.value)

    expect(operatorTokens).toContain('??=')
  })
})
