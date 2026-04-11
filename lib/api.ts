import type { TokenStream } from './core/types'
import { tokenize } from './language/manager'
import { resolveScopeStyle, resolveTheme } from './themes'
import type { HighlightTheme } from './themes/types'

const DEFAULT_PRE_STYLE =
  "background: #1E1E1E; padding: 16px; border-radius: 8px; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.5; white-space: pre;"

const THEME_ALIAS_MAP: Record<string, string> = {
  github: 'github-light',
  dark: 'dark-plus'
}

export interface CodeToTokensOptions {
  lang: string
}

export interface CodeToHtmlOptions extends CodeToTokensOptions {
  theme?: string | HighlightTheme
  preStyle?: string
  lineClassPrefix?: string
}

const normalizeLanguageId = (lang: string): string => {
  const normalized = lang.trim().toLowerCase()
  if (!normalized) {
    throw new Error('Option "lang" cannot be empty')
  }
  return normalized
}

const normalizeThemeOption = (
  theme: string | HighlightTheme | undefined
): string | HighlightTheme | undefined => {
  if (!theme || typeof theme !== 'string') {
    return theme
  }

  const normalized = theme.trim().toLowerCase()
  if (!normalized) return undefined
  return THEME_ALIAS_MAP[normalized] ?? normalized
}

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;')
    .replace(/\$/g, '&#36;')
    .replace(/\t/g, '&#9;')
}

export const codeToTokens = (
  code: string,
  options: CodeToTokensOptions
): TokenStream => {
  const languageId = normalizeLanguageId(options.lang)
  return tokenize(code, languageId)
}

export const codeToHtml = (code: string, options: CodeToHtmlOptions): string => {
  const rows = codeToTokens(code, options)
  const theme = resolveTheme(normalizeThemeOption(options.theme))
  const preStyle = options.preStyle ?? theme.preStyle ?? DEFAULT_PRE_STYLE
  const lineClassPrefix = options.lineClassPrefix ?? 'line-'

  const rowsHtml = rows
    .map((rowTokens, rowIndex) => {
      const lineTokensHtml = rowTokens
        .map((token) => {
          const style = resolveScopeStyle(token.scope, theme)
          return `<span style="${style}">${escapeHtml(token.text)}</span>`
        })
        .join('')

      return `<div class="code-line ${lineClassPrefix}${rowIndex + 1}">${lineTokensHtml}</div>`
    })
    .join('')

  return `<pre style="${preStyle}"><code>${rowsHtml}</code></pre>`
}
