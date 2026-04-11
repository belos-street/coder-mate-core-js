import { tokenize } from 'lib/language'
import type { TokenStream } from 'lib/core/types'
import type { HighlightTheme } from 'lib/themes'
import { resolveScopeStyle, resolveTheme } from 'lib/themes'

const DEFAULT_PRE_STYLE =
  "background: #1E1E1E; padding: 16px; border-radius: 8px; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.5; white-space: pre;"

export interface RenderHtmlOptions {
  theme?: string | HighlightTheme
  preStyle?: string
  lineClassPrefix?: string
}

/**
 * HTML 特殊字符转义
 */
export const escapeHtml = (text: string): string => {
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

const stringifyInlineStyle = (style: Record<string, string>): string => {
  const entries = Object.entries(style)
  if (entries.length === 0) return ''

  return entries
    .map(([property, value]) => `${property}: ${value};`)
    .join(' ')
}

/**
 * 渲染 token 流为 HTML
 */
export const renderHtml = <Scope extends string>(
  rows: TokenStream<Scope>,
  options?: RenderHtmlOptions
): string => {
  const theme = resolveTheme(options?.theme)
  const preStyle = options?.preStyle ?? theme.preStyle ?? DEFAULT_PRE_STYLE
  const lineClassPrefix = options?.lineClassPrefix ?? 'line-'

  const rowsHtml = rows
    .map((rowTokens, rowIndex) => {
      const lineTokensHtml = rowTokens
        .map((token) => {
          const styleFromToken = stringifyInlineStyle(token.style)
          const style =
            styleFromToken || resolveScopeStyle(token.scope, theme)
          return `<span style="${style}">${escapeHtml(token.text)}</span>`
        })
        .join('')

      return `<div class="code-line ${lineClassPrefix}${rowIndex + 1}">${lineTokensHtml}</div>`
    })
    .join('')

  return `<pre style="${preStyle}"><code>${rowsHtml}</code></pre>`
}

/**
 * JavaScript 代码高亮（调试/展示层）
 */
export const highlightJavaScript = (
  code: string,
  options?: RenderHtmlOptions
): string => {
  const rows = tokenize(code, 'javascript')
  return renderHtml(rows, options)
}
