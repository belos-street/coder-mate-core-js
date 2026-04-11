import type { TokenStream, TokenStyle } from './core/types'
import { tokenize } from './language/manager'
import { resolveTheme } from './themes'
import type { HighlightTheme } from './themes/types'

const DEFAULT_PRE_STYLE =
  "background: #1E1E1E; padding: 16px; border-radius: 8px; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.5; white-space: pre;"

const THEME_ALIAS_MAP: Record<string, string> = {
  github: 'github-light',
  dark: 'dark-plus'
}

export interface CreateHighlighterOptions {
  theme?: string | HighlightTheme
  preStyle?: string
  lineClassPrefix?: string
}

export interface CodeToTokensOptions {
  lang: string
}

export interface CodeToHtmlOptions extends CodeToTokensOptions {
  preStyle?: string
  lineClassPrefix?: string
}

export interface Highlighter {
  codeToTokens(code: string, options: CodeToTokensOptions): Promise<TokenStream>
  codeToHtml(code: string, options: CodeToHtmlOptions): Promise<string>
  updateTheme(theme: string | HighlightTheme): Promise<void>
}

interface CachedEntry {
  baseRows: TokenStream
  styledRows: TokenStream
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

const parseInlineStyle = (styleText: string): TokenStyle => {
  const style: TokenStyle = {}
  const declarations = styleText.split(';')

  for (const declaration of declarations) {
    const trimmed = declaration.trim()
    if (!trimmed) continue

    const separatorIndex = trimmed.indexOf(':')
    if (separatorIndex === -1) continue

    const property = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim()

    if (!property || !value) continue
    style[property] = value
  }

  return style
}

const stringifyInlineStyle = (style: TokenStyle): string => {
  const entries = Object.entries(style)
  if (entries.length === 0) return ''

  return entries.map(([property, value]) => `${property}: ${value};`).join(' ')
}

const cloneTokenStream = (rows: TokenStream): TokenStream => {
  return rows.map((rowTokens) =>
    rowTokens.map((token) => ({
      ...token,
      col: [token.col[0], token.col[1]],
      style: { ...token.style }
    }))
  )
}

const applyThemeStyles = (
  rows: TokenStream,
  theme: HighlightTheme
): TokenStream => {
  const parsedStyleCache = new Map<string, TokenStyle>()

  return rows.map((rowTokens) =>
    rowTokens.map((token) => {
      const styleText =
        theme.styles[token.scope] ??
        (() => {
          let candidate = token.scope
          while (candidate.includes('.')) {
            const index = candidate.lastIndexOf('.')
            candidate = candidate.slice(0, index)
            const fallback = theme.styles[candidate]
            if (fallback) return fallback
          }
          return theme.styles.default ?? theme.defaultStyle
        })()

      const cached = parsedStyleCache.get(styleText)
      if (cached) {
        return {
          ...token,
          style: { ...cached }
        }
      }

      const parsed = parseInlineStyle(styleText)
      parsedStyleCache.set(styleText, parsed)

      return {
        ...token,
        style: { ...parsed }
      }
    })
  )
}

const createCacheKey = (languageId: string, code: string): string =>
  `${languageId}\u0000${code}`

export const createHighlighter = (
  options: CreateHighlighterOptions = {}
): Highlighter => {
  let currentTheme = resolveTheme(normalizeThemeOption(options.theme))
  const defaultPreStyle = options.preStyle
  const defaultLineClassPrefix = options.lineClassPrefix
  const cache = new Map<string, CachedEntry>()

  const codeToTokens = async (
    code: string,
    tokenizeOptions: CodeToTokensOptions
  ): Promise<TokenStream> => {
    const languageId = normalizeLanguageId(tokenizeOptions.lang)
    const cacheKey = createCacheKey(languageId, code)
    const cached = cache.get(cacheKey)

    if (cached) {
      return cloneTokenStream(cached.styledRows)
    }

    const baseRows = tokenize(code, languageId)
    const styledRows = applyThemeStyles(baseRows, currentTheme)

    cache.set(cacheKey, {
      baseRows,
      styledRows
    })

    return cloneTokenStream(styledRows)
  }

  const codeToHtml = async (
    code: string,
    htmlOptions: CodeToHtmlOptions
  ): Promise<string> => {
    const rows = await codeToTokens(code, { lang: htmlOptions.lang })
    const preStyle =
      htmlOptions.preStyle ??
      defaultPreStyle ??
      currentTheme.preStyle ??
      DEFAULT_PRE_STYLE
    const lineClassPrefix =
      htmlOptions.lineClassPrefix ?? defaultLineClassPrefix ?? 'line-'

    const rowsHtml = rows
      .map((rowTokens, rowIndex) => {
        const lineTokensHtml = rowTokens
          .map((token) => {
            const style = stringifyInlineStyle(token.style)
            return `<span style="${style}">${escapeHtml(token.text)}</span>`
          })
          .join('')

        return `<div class="code-line ${lineClassPrefix}${rowIndex + 1}">${lineTokensHtml}</div>`
      })
      .join('')

    return `<pre style="${preStyle}"><code>${rowsHtml}</code></pre>`
  }

  const updateTheme = async (theme: string | HighlightTheme): Promise<void> => {
    currentTheme = resolveTheme(normalizeThemeOption(theme))

    for (const [cacheKey, entry] of cache.entries()) {
      cache.set(cacheKey, {
        ...entry,
        styledRows: applyThemeStyles(entry.baseRows, currentTheme)
      })
    }
  }

  return {
    codeToTokens,
    codeToHtml,
    updateTheme
  }
}
