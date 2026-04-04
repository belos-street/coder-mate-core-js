import type { TokenStream } from 'lib/language/javascript/type'

export function renderTokensToHtml(tokenStream: TokenStream): string {
  let html = '<pre class="code-block"><code>'

  for (const lineTokens of tokenStream) {
    for (const token of lineTokens) {
      const escapedValue = escapeHtml(token.value)
      html += `<span class="${token.type}">${escapedValue}</span>`
    }
    html += '\n'
  }

  html += '</code></pre>'
  return html
}

export function renderToApp(tokenStream: TokenStream): void {
  const html = renderTokensToHtml(tokenStream)

  const app = globalThis.document.getElementById('app') as HTMLElement
  if (!app) {
    console.error('Element with id "app" not found')
    return
  }

  app.innerHTML = html
}

export function escapeHtml(text: string): string {        
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
