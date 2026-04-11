import { darkPlusTheme } from './dark-plus/index'
import { githubLightTheme, presetBuiltInThemes } from './presets'
import type { HighlightTheme } from './types'

export type { HighlightTheme, ThemeStyleMap } from './types'
export { darkPlusTheme } from './dark-plus/index'
export { githubLightTheme } from './presets'
export {
  draculaTheme,
  oneDarkProTheme,
  nordTheme,
  monokaiTheme,
  materialOceanTheme,
  tokyoNightTheme,
  solarizedDarkTheme,
  solarizedLightTheme
} from './presets'

export const DEFAULT_THEME_ID = darkPlusTheme.id

const themeRegistry = new Map<string, HighlightTheme>()

const normalizeThemeId = (themeId: string): string => themeId.trim().toLowerCase()

export const registerTheme = (theme: HighlightTheme): void => {
  const normalizedId = normalizeThemeId(theme.id)
  if (!normalizedId) {
    throw new Error('Theme id cannot be empty')
  }

  const existing = themeRegistry.get(normalizedId)
  if (existing && existing !== theme) {
    throw new Error(`Theme "${theme.id}" is already registered`)
  }

  themeRegistry.set(normalizedId, theme)
}

export const getTheme = (themeId: string = DEFAULT_THEME_ID): HighlightTheme => {
  const normalizedId = normalizeThemeId(themeId)
  if (!normalizedId) {
    throw new Error('Theme id cannot be empty')
  }

  const theme = themeRegistry.get(normalizedId)
  if (!theme) {
    throw new Error(`Theme "${themeId}" is not registered`)
  }

  return theme
}

export const listThemes = (): HighlightTheme[] => Array.from(themeRegistry.values())

/**
 * scope 查找顺序：
 * 1) 精确匹配
 * 2) 前缀回退（a.b.c -> a.b -> a）
 * 3) defaultStyle
 */
export const resolveScopeStyle = (
  scope: string,
  theme: HighlightTheme
): string => {
  const exact = theme.styles[scope]
  if (exact) return exact

  let candidate = scope
  while (candidate.includes('.')) {
    const index = candidate.lastIndexOf('.')
    candidate = candidate.slice(0, index)
    const fallback = theme.styles[candidate]
    if (fallback) return fallback
  }

  return theme.styles.default ?? theme.defaultStyle
}

export const resolveTheme = (
  theme: string | HighlightTheme | undefined
): HighlightTheme => {
  if (!theme) return getTheme()
  if (typeof theme === 'string') return getTheme(theme)
  return theme
}

registerTheme(darkPlusTheme)
presetBuiltInThemes.forEach((theme) => registerTheme(theme))
