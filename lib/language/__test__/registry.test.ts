import { beforeEach, describe, expect, test } from 'bun:test'
import {
  getLanguage,
  listLanguages,
  registerLanguage,
  resetLanguageRegistryForTest,
  tokenize
} from '../index'
import type { LanguageAdapter } from '../../core/registry'

describe('语言注册中心', () => {
  beforeEach(() => {
    resetLanguageRegistryForTest()
  })

  test('默认内置语言会自动注册', () => {
    const languages = listLanguages()
    const ids = languages.map((lang) => lang.id)
    expect(ids).toContain('javascript')
    expect(ids).toContain('json')
    expect(ids).toContain('python')
  })

  test('支持通过 alias 使用语言（js -> javascript）', () => {
    const tokens = tokenize('const x = 1;', 'js')
    expect(tokens.length).toBeGreaterThan(0)
    expect(tokens[0]![0]!.text).toBe('const')
  })

  test('未知语言会抛出错误', () => {
    expect(() => tokenize('x', 'unknown-lang')).toThrow(
      'Language "unknown-lang" is not registered'
    )
  })

  test('可注册自定义语言并访问', () => {
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
