import { describe, it, expect } from 'bun:test'
import { generateJavaScriptTokens } from '../main'

describe('模板字符串', () => {
  it('should tokenize simple template string', () => {
    const code = '`hello`'
    const tokens = generateJavaScriptTokens(code)

    const templateTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-template-string')

    expect(templateTokens.length).toBe(1)
    expect(templateTokens[0]?.value).toBe('hello')
  })

  it('should tokenize template string with expression', () => {
    const code = '`Hello ${name}!`'
    const tokens = generateJavaScriptTokens(code)

    const templateTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-template-string')
    const identifierTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-identifier')

    expect(templateTokens.length).toBe(2)
    expect(templateTokens[0]?.value).toBe('Hello ')
    expect(templateTokens[1]?.value).toBe('!')
    expect(identifierTokens.length).toBe(1)
    expect(identifierTokens[0]?.value).toBe('name')
  })

  it('should tokenize template string with complex expression', () => {
    const code = '`count: ${count + 1}`'
    const tokens = generateJavaScriptTokens(code)

    const templateTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-template-string')
    const operatorTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-operator')
    const identifierTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-identifier')

    expect(templateTokens.length).toBe(1)
    expect(templateTokens[0]?.value).toBe('count: ')
    expect(operatorTokens.some((t) => t.value === '+')).toBe(true)
    expect(identifierTokens.some((t) => t.value === 'count')).toBe(true)
  })

  it('should tokenize template string with optional chaining', () => {
    const code = '`value: ${obj?.prop}`'
    const tokens = generateJavaScriptTokens(code)

    const identifierTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-identifier')

    expect(identifierTokens.length).toBe(2)
    expect(identifierTokens[0]?.value).toBe('obj')
    expect(identifierTokens[1]?.value).toBe('prop')
  })

  it('should tokenize template string with function call', () => {
    const code = '`result: ${getValue()}`'
    const tokens = generateJavaScriptTokens(code)

    const templateTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-template-string')
    const identifierTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-identifier')

    expect(templateTokens.length).toBe(1)
    expect(templateTokens[0]?.value).toBe('result: ')
    expect(identifierTokens.some((t) => t.value === 'getValue')).toBe(true)
  })

  it('should tokenize multiline template string', () => {
    const code = `\`line1
line2\``
    const tokens = generateJavaScriptTokens(code)

    const templateTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-template-string')

    expect(templateTokens.length).toBe(1)
    expect(templateTokens[0]?.value).toContain('\n')
  })
})
