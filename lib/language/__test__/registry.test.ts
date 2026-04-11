import { beforeEach, describe, expect, test } from 'bun:test'
import {
  getLanguage,
  listLanguages,
  registerLanguage,
  resetLanguageRegistryForTest,
  tokenize
} from '../index'
import type { LanguageAdapter } from '../../core/registry'

describe('language registry', () => {
  beforeEach(() => {
    resetLanguageRegistryForTest()
  })

  test('registers builtin languages automatically', () => {
    const languages = listLanguages()
    const ids = languages.map((lang) => lang.id)

    expect(ids).toContain('javascript')
    expect(ids).toContain('typescript')
    expect(ids).toContain('html')
    expect(ids).toContain('json')
    expect(ids).toContain('python')
  })

  test('supports JavaScript alias (js -> javascript)', () => {
    const tokens = tokenize('const x = 1;', 'js')

    expect(tokens.length).toBeGreaterThan(0)
    expect(tokens[0]![0]!.text).toBe('const')
  })

  test('supports TypeScript alias (ts -> typescript)', () => {
    const tokens = tokenize('type UserId = string', 'ts')

    expect(tokens.length).toBeGreaterThan(0)
    expect(tokens[0]![0]!.text).toBe('type')
  })

  test('supports HTML alias (htm -> html)', () => {
    const tokens = tokenize('<div>hello</div>', 'htm')
    const flatTokens = tokens.flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(flatTokens.some((t) => t.scope === 'entity.name.tag.html')).toBe(true)
  })

  test('throws for unknown language', () => {
    expect(() => tokenize('x', 'unknown-lang')).toThrow(
      'Language "unknown-lang" is not registered'
    )
  })

  test('registers and resolves custom languages', () => {
    const customLanguage: LanguageAdapter = {
      id: 'plain',
      aliases: ['txt'],
      parse: (code) => [[{ text: code, scope: 'default', line: 1, col: [1, code.length] }]]
    }

    registerLanguage(customLanguage)

    const byId = getLanguage('plain')
    const byAlias = getLanguage('txt')

    expect(byId).toBeDefined()
    expect(byAlias).toBeDefined()
    expect(tokenize('hello', 'txt')[0]![0]!.text).toBe('hello')
  })
})
