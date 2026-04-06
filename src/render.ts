import type { TokenStream } from 'lib/language/javascript/type'

const style = document.createElement('style')
style.textContent = `
  body { font-family: monospace; padding: 20px; }
  .code-block {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;
  }
  .token-keyword { color: #569cd6; }
  .token-literal { color: #569cd6; }
  .token-string { color: #ce9178; }
  .token-number { color: #b5cea8; }
  .token-identifier { color: #9cdcfe; }
  .token-operator { color: #d4d4d4; }
  .token-punctuation { color: #d4d4d4; }
  .token-comment { color: #6a9955; }
  .token-whitespace { color: transparent; }
`
document.head.appendChild(style)

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
