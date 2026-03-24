import { describe, it, expect } from 'bun:test'
import { grammarRules } from 'lib/language/javascript/rule'

describe('grammarRules', () => {
  const rules = grammarRules.initial

  function matchRule(
    code: string,
    pos: number
  ): { token: string; value: string } | null {
    for (const rule of rules) {
      rule.regex.lastIndex = pos
      const match = rule.regex.exec(code)
      if (match && match.index === pos) {
        return { token: rule.token, value: match[1] || '' }
      }
    }
    return null
  }

  it('should match comment regex', () => {
    const result = matchRule('// this is a comment', 0)
    expect(result?.token).toBe('token-comment')
    expect(result?.value).toBe('// this is a comment')
  })

  it('should match string regex with double quotes', () => {
    const result = matchRule('"hello"', 0)
    expect(result?.token).toBe('token-string')
    expect(result?.value).toBe('"hello"')
  })

  it('should match string regex with single quotes', () => {
    const result = matchRule("'world'", 0)
    expect(result?.token).toBe('token-string')
    expect(result?.value).toBe("'world'")
  })

  it('should match keyword regex', () => {
    const keywords = [
      'let',
      'const',
      'var',
      'function',
      'return',
      'if',
      'else',
      'for',
      'while'
    ]
    for (const kw of keywords) {
      const result = matchRule(kw, 0)
      expect(result?.token).toBe('token-keyword')
      expect(result?.value).toBe(kw)
    }
  })

  it('should match number regex', () => {
    const result = matchRule('42', 0)
    expect(result?.token).toBe('token-number')
    expect(result?.value).toBe('42')
  })

  it('should match decimal number regex', () => {
    const result = matchRule('3.14', 0)
    expect(result?.token).toBe('token-number')
    expect(result?.value).toBe('3.14')
  })

  it('should match identifier regex', () => {
    const identifiers = ['foo', '_bar', '$baz', 'qux1']
    for (const ident of identifiers) {
      const result = matchRule(ident, 0)
      expect(result?.token).toBe('token-ident')
      expect(result?.value).toBe(ident)
    }
  })

  it('should match punctuation regex', () => {
    const punctuations = [
      ';',
      ',',
      '.',
      '(',
      ')',
      '{',
      '}',
      '[',
      ']',
      '=',
      '+',
      '-',
      '*',
      '/',
      '<',
      '>'
    ]
    for (const p of punctuations) {
      const result = matchRule(p, 0)
      expect(result?.token).toBe('token-punctuation')
      expect(result?.value).toBe(p)
    }
  })

  it('should match whitespace regex', () => {
    const result = matchRule('   ', 0)
    expect(result?.token).toBe('token-whitespace')
    expect(result?.value).toBe('   ')
  })

  it('should match newline regex', () => {
    const result = matchRule('\n', 0)
    expect(result?.token).toBe('token-newline')
    expect(result?.value).toBe('\n')
  })
})
