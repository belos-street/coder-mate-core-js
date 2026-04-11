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
    expect(ids).toContain('css')
    expect(ids).toContain('bash')
    expect(ids).toContain('sql')
    expect(ids).toContain('yaml')
    expect(ids).toContain('markdown')
    expect(ids).toContain('java')
    expect(ids).toContain('c')
    expect(ids).toContain('cpp')
    expect(ids).toContain('csharp')
    expect(ids).toContain('go')
    expect(ids).toContain('rust')
    expect(ids).toContain('php')
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

  test('supports Bash alias (sh -> bash)', () => {
    const tokens = tokenize('echo "hi"', 'sh')
    const flatTokens = tokens.flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(
      flatTokens.some((t) => t.scope === 'support.function.builtin.bash')
    ).toBe(true)
  })

  test('supports SQL alias (postgresql -> sql)', () => {
    const tokens = tokenize('SELECT id FROM users;', 'postgresql')
    const flatTokens = tokens.flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(flatTokens.some((t) => t.scope === 'keyword.control.sql')).toBe(true)
  })

  test('supports YAML alias (yml -> yaml)', () => {
    const tokens = tokenize('name: coder-mate', 'yml')
    const flatTokens = tokens.flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(
      flatTokens.some((t) => t.scope === 'support.type.property-name.yaml')
    ).toBe(true)
  })

  test('supports Markdown alias (md -> markdown)', () => {
    const tokens = tokenize('# title', 'md')
    const flatTokens = tokens.flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(flatTokens.some((t) => t.scope === 'markup.heading.markdown')).toBe(
      true
    )
  })

  test('supports Java alias (jav -> java)', () => {
    const tokens = tokenize('public class Demo {}', 'jav')
    const flatTokens = tokens.flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(flatTokens.some((t) => t.scope === 'keyword.declaration.java')).toBe(
      true
    )
  })

  test('supports C alias (h -> c)', () => {
    const tokens = tokenize('int add(int a, int b) { return a + b; }', 'h')
    const flatTokens = tokens.flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(flatTokens.some((t) => t.scope === 'keyword.control.c')).toBe(true)
  })

  test('supports C++ alias (c++ -> cpp)', () => {
    const tokens = tokenize('class Demo { public: int id; };', 'c++')
    const flatTokens = tokens.flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(flatTokens.some((t) => t.scope === 'keyword.declaration.cpp')).toBe(
      true
    )
  })

  test('supports Go alias (golang -> go)', () => {
    const tokens = tokenize('func add(a int, b int) int { return a + b }', 'golang')
    const flatTokens = tokens.flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(flatTokens.some((t) => t.scope === 'keyword.declaration.go')).toBe(
      true
    )
  })

  test('supports Rust alias (rs -> rust)', () => {
    const tokens = tokenize('fn add(a: i32, b: i32) -> i32 { a + b }', 'rs')
    const flatTokens = tokens.flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(flatTokens.some((t) => t.scope === 'keyword.declaration.rust')).toBe(
      true
    )
  })

  test('supports C# alias (cs -> csharp)', () => {
    const tokens = tokenize('public class Demo { }', 'cs')
    const sharpTokens = tokenize('public class Demo { }', 'c#')
    const flatTokens = tokens.flat()
    const flatSharpTokens = sharpTokens.flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(sharpTokens.length).toBeGreaterThan(0)
    expect(
      flatTokens.some((t) => t.scope === 'keyword.declaration.csharp')
    ).toBe(true)
    expect(
      flatSharpTokens.some((t) => t.scope === 'keyword.declaration.csharp')
    ).toBe(true)
  })

  test('supports PHP alias (phtml -> php)', () => {
    const tokens = tokenize('<?php echo "hi";', 'phtml')
    const flatTokens = tokens.flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(flatTokens.some((t) => t.scope === 'keyword.control.php')).toBe(true)
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
      parse: (code) => [
        [
          {
            text: code,
            scope: 'default',
            line: 1,
            col: [1, code.length],
            style: {}
          }
        ]
      ]
    }

    registerLanguage(customLanguage)

    const byId = getLanguage('plain')
    const byAlias = getLanguage('txt')

    expect(byId).toBeDefined()
    expect(byAlias).toBeDefined()
    expect(tokenize('hello', 'txt')[0]![0]!.text).toBe('hello')
  })
})
