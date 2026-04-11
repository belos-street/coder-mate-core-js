import { listLanguages, tokenize } from '../dist/language.js'
import { getTheme, listThemes } from '../dist/themes.js'
import { createHighlighter } from '../dist/index.js'

const languageIds = listLanguages().map((language) => language.id)
if (!languageIds.includes('javascript') || !languageIds.includes('json')) {
  throw new Error(
    `Built language bundle missing expected languages: ${languageIds}`
  )
}

const jsonTokens = tokenize('{"a":1,"ok":true}', 'json').flat()
if (jsonTokens.length === 0) {
  throw new Error('Built language bundle returned empty JSON tokens')
}

const highlighter = createHighlighter({ theme: 'github' })

const rootTokens = (await highlighter.codeToTokens('{"value":-1.2e+3}', {
  lang: 'json'
})).flat()
if (rootTokens.length === 0) {
  throw new Error('Built root bundle codeToTokens() returned empty rows')
}

const rootHtml = await highlighter.codeToHtml('const x = 1;', {
  lang: 'javascript'
})
if (!rootHtml.includes('<pre') || !rootHtml.includes('const')) {
  throw new Error('Built root bundle codeToHtml() returned invalid html')
}

const themeIds = listThemes().map((theme) => theme.id)
if (!themeIds.includes('dark-plus') || !themeIds.includes('github-light')) {
  throw new Error(`Built theme bundle missing expected themes: ${themeIds}`)
}

const lightTheme = getTheme('github-light')
if (!lightTheme.styles['string.quoted.double.json']) {
  throw new Error('Built theme bundle missing JSON string style mapping')
}

console.log('Build import smoke test passed')

const text = `12312321312321`
