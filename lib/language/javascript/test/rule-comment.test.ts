import { describe, it, expect } from 'bun:test'
import { generateJavaScriptTokens } from '../main'

describe('多行注释', () => {
  it('should tokenize single-line comment', () => {
    const code = '// comment'
    const tokens = generateJavaScriptTokens(code)

    const commentTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-comment')

    expect(commentTokens.length).toBe(1)
    expect(commentTokens[0]?.value).toBe('// comment')
  })

  it('should tokenize multi-line comment', () => {
    const code = '/* hello */'
    const tokens = generateJavaScriptTokens(code)

    const commentTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-comment')

    expect(commentTokens.length).toBe(1)
    expect(commentTokens[0]?.value).toBe('/* hello */')
  })

  it('should tokenize multi-line comment with newlines', () => {
    const code = `/* line1
line2 */`
    const tokens = generateJavaScriptTokens(code)

    const commentTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-comment')

    expect(commentTokens.length).toBe(1)
    expect(commentTokens[0]?.value).toContain('\n')
  })

  it('should tokenize multi-line comment with asterisk', () => {
    const code = `/*
 * Multi-line
 * Comment
 */`
    const tokens = generateJavaScriptTokens(code)

    const commentTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-comment')

    expect(commentTokens.length).toBe(1)
    expect(commentTokens[0]?.value).toContain('*')
  })

  it('should tokenize JSDoc comment', () => {
    const code = `/**
 * JSDoc comment
 * @param {string} name
 */`
    const tokens = generateJavaScriptTokens(code)

    const commentTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-comment')

    expect(commentTokens.length).toBe(1)
    expect(commentTokens[0]?.value).toContain('@param')
  })

  it('should handle code after multi-line comment', () => {
    const code = `/* comment */const x = 1;`
    const tokens = generateJavaScriptTokens(code)

    const commentTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-comment')
    const keywordTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-keyword')

    expect(commentTokens.length).toBe(1)
    expect(keywordTokens.length).toBe(1)
    expect(keywordTokens[0]?.value).toBe('const')
  })
})