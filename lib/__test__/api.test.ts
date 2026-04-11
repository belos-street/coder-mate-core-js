import { describe, expect, test } from 'bun:test'
import { createHighlighter } from '..'

describe('public api', () => {
  test('codeToTokens parses rows by language id', async () => {
    const highlighter = createHighlighter()
    const rows = await highlighter.codeToTokens('type UserId = string | number', {
      lang: 'typescript'
    })

    expect(rows.length).toBeGreaterThan(0)
    expect(rows.flat().some((t) => t.text === 'type')).toBe(true)
  })

  test('codeToTokens always includes style object for custom rendering', async () => {
    const highlighter = createHighlighter({ theme: 'github' })
    const rows = await highlighter.codeToTokens('/* note */', {
      lang: 'javascript'
    })

    const first = rows.flat()[0]
    expect(first?.scope).toBe('comment.block.js')
    expect(first?.style.color).toBe('#6A737D')
    expect(first?.style['font-style']).toBe('italic')
  })

  test('updateTheme refreshes token styles without changing token text', async () => {
    const highlighter = createHighlighter({ theme: 'dark-plus' })

    const darkRows = await highlighter.codeToTokens('const value = 1', {
      lang: 'javascript'
    })
    const darkConstToken = darkRows.flat().find((t) => t.text === 'const')

    await highlighter.updateTheme('github-light')

    const lightRows = await highlighter.codeToTokens('const value = 1', {
      lang: 'javascript'
    })
    const lightConstToken = lightRows.flat().find((t) => t.text === 'const')

    expect(darkConstToken?.scope).toBe('keyword.declaration.js')
    expect(lightConstToken?.scope).toBe('keyword.declaration.js')
    expect(darkConstToken?.style.color).toBe('#569CD6')
    expect(lightConstToken?.style.color).toBe('#D73A49')
  })

  test('codeToHtml renders html using theme alias', async () => {
    const highlighter = createHighlighter({ theme: 'github' })
    const html = await highlighter.codeToHtml(
      'const value = profile?.city ?? "Unknown"',
      {
        lang: 'javascript'
      }
    )

    expect(html.includes('<pre')).toBe(true)
    expect(html.includes('<code>')).toBe(true)
    expect(html.includes('const')).toBe(true)
  })

  test('codeToTokens throws on unknown language', async () => {
    const highlighter = createHighlighter()

    let error: unknown = null
    try {
      await highlighter.codeToTokens('hello', { lang: 'unknown-lang' })
    } catch (caught) {
      error = caught
    }

    expect((error as Error).message).toBe(
      'Language "unknown-lang" is not registered'
    )
  })

  test('codeToTokens validates empty language option', async () => {
    const highlighter = createHighlighter()

    let error: unknown = null
    try {
      await highlighter.codeToTokens('hello', { lang: '   ' })
    } catch (caught) {
      error = caught
    }

    expect((error as Error).message).toBe('Option "lang" cannot be empty')
  })
})
