import { describe, expect, test } from 'bun:test'
import { getTheme, listThemes, resolveScopeStyle } from '..'
import type { HighlightTheme } from '../types'

describe('theme registry', () => {
  test('default theme is available', () => {
    const theme = getTheme()

    expect(theme.id).toBe('dark-plus')
    expect(theme.styles.default).toContain('#D4D4D4')
  })

  test('built-in themes are listed', () => {
    const themeIds = listThemes().map((theme) => theme.id)

    expect(themeIds).toContain('dark-plus')
    expect(themeIds).toContain('github-light')
  })

  test('scope style resolves by prefix fallback', () => {
    const theme: HighlightTheme = {
      id: 'tmp-prefix-theme',
      displayName: 'Temporary Prefix Theme',
      defaultStyle: 'color: #000;',
      styles: {
        keyword: 'color: #111;',
        'keyword.control': 'color: #222;'
      }
    }

    const style = resolveScopeStyle('keyword.control.import.js', theme)
    expect(style).toBe('color: #222;')
  })

  test('unknown scope falls back to default style', () => {
    const theme = getTheme('github-light')
    const style = resolveScopeStyle('unknown.scope.anything', theme)

    expect(style).toBe(theme.styles.default ?? theme.defaultStyle)
  })

  test('registers additional built-in themes', () => {
    const themeIds = new Set(listThemes().map((theme) => theme.id))

    expect(themeIds.has('dracula')).toBe(true)
    expect(themeIds.has('one-dark-pro')).toBe(true)
    expect(themeIds.has('nord')).toBe(true)
    expect(themeIds.has('monokai')).toBe(true)
    expect(themeIds.has('material-ocean')).toBe(true)
    expect(themeIds.has('tokyo-night')).toBe(true)
    expect(themeIds.has('solarized-dark')).toBe(true)
    expect(themeIds.has('solarized-light')).toBe(true)
  })
})
