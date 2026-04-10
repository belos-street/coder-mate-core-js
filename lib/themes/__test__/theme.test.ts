import { describe, expect, test } from 'bun:test'
import { getTheme, listThemes, resolveScopeStyle } from '..'
import type { HighlightTheme } from '../types'

describe('theme registry', () => {
  test('默认主题可用', () => {
    const theme = getTheme()

    expect(theme.id).toBe('dark-plus')
    expect(theme.styles.default).toContain('#D4D4D4')
  })

  test('内置主题可枚举', () => {
    const themeIds = listThemes().map((theme) => theme.id)

    expect(themeIds).toContain('dark-plus')
    expect(themeIds).toContain('github-light')
  })

  test('scope 样式支持前缀回退', () => {
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

  test('未命中 scope 时回退到默认样式', () => {
    const theme = getTheme('github-light')
    const style = resolveScopeStyle('unknown.scope.anything', theme)

    expect(style).toBe(theme.styles.default ?? theme.defaultStyle)
  })
})
