import { describe, expect, test } from 'bun:test'
import { codeToHtml, codeToTokens } from '..'

describe('public api', () => {
  test('codeToTokens parses rows by language id', () => {
    const rows = codeToTokens('type UserId = string | number', {
      lang: 'typescript'
    })

    expect(rows.length).toBeGreaterThan(0)
    expect(rows.flat().some((t) => t.text === 'type')).toBe(true)
  })

  test('codeToHtml renders html using theme alias', () => {
    const html = codeToHtml('const value = profile?.city ?? "Unknown"', {
      lang: 'javascript',
      theme: 'github'
    })

    expect(html.includes('<pre')).toBe(true)
    expect(html.includes('<code>')).toBe(true)
    expect(html.includes('const')).toBe(true)
  })

  test('codeToTokens throws on unknown language', () => {
    expect(() => codeToTokens('hello', { lang: 'unknown-lang' })).toThrow(
      'Language "unknown-lang" is not registered'
    )
  })

  test('codeToTokens validates empty language option', () => {
    expect(() => codeToTokens('hello', { lang: '   ' })).toThrow(
      'Option "lang" cannot be empty'
    )
  })
})
