import { highlightJavaScript, renderHtml } from '../dist-src/render.js'
import { tokenize } from '../dist/language.js'

const html = highlightJavaScript('const x = 1;', { theme: 'github-light' })
if (!html.includes('<pre') || !html.includes('const')) {
  throw new Error('dist-src render bundle failed: highlightJavaScript output invalid')
}

const rows = tokenize('{"a":1}', 'json')
const jsonHtml = renderHtml(rows, { theme: 'dark-plus' })
if (!jsonHtml.includes('<code>') || !jsonHtml.includes('{')) {
  throw new Error('dist-src render bundle failed: renderHtml output invalid')
}

console.log('Build src import smoke test passed')
