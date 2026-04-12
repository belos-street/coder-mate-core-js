import { createHighlighter } from 'lib'
import { listLanguages } from 'lib/language'
import { LANGUAGE_LABELS, LANGUAGE_SNIPPETS } from './languages'
import { LANGUAGE_ORDER, type DemoState, type LanguageId } from './types'
import { escapeHtml } from './utils'

const THEME_LIST = [
  { id: 'dark-plus', displayName: 'Dark+' },
  { id: 'github-light', displayName: 'GitHub Light' },
  { id: 'dracula', displayName: 'Dracula' },
  { id: 'one-dark-pro', displayName: 'One Dark Pro' },
  { id: 'nord', displayName: 'Nord' },
  { id: 'monokai', displayName: 'Monokai' },
  { id: 'material-ocean', displayName: 'Material Ocean' },
  { id: 'tokyo-night', displayName: 'Tokyo Night' },
  { id: 'solarized-dark', displayName: 'Solarized Dark' },
  { id: 'solarized-light', displayName: 'Solarized Light' }
] as const

type ThemeId = (typeof THEME_LIST)[number]['id']

const supportedLanguages = new Set<string>(
  listLanguages().map((language) => language.id.toLowerCase())
)

const isLanguageSupported = (languageId: LanguageId): boolean =>
  supportedLanguages.has(languageId)

const renderThemeTabs = (state: DemoState): string =>
  THEME_LIST.map((theme) => {
    const activeClass = theme.id === state.themeId ? 'is-active' : ''
    return `<button class="tab-btn ${activeClass}" data-role="theme-tab" data-theme="${theme.id}" title="${theme.displayName}">
  <span>${theme.displayName}</span>
</button>`
  }).join('')

const renderLanguageTabs = (state: DemoState): string =>
  LANGUAGE_ORDER.map((languageId) => {
    const isActive = languageId === state.languageId
    const supported = isLanguageSupported(languageId)
    const activeClass = isActive ? 'is-active' : ''
    const disabledClass = supported ? '' : 'is-disabled'
    const badge = supported ? '' : '<em class="soon">Soon</em>'
    return `<button class="tab-btn ${activeClass} ${disabledClass}" data-role="language-tab" data-language="${languageId}">
  <span>${LANGUAGE_LABELS[languageId]}</span>
  ${badge}
</button>`
  }).join('')

const renderPreview = async (
  state: DemoState,
  highlighter: ReturnType<typeof createHighlighter>
): Promise<string> => {
  if (!isLanguageSupported(state.languageId)) {
    return `<div class="placeholder">
  <h3>${LANGUAGE_LABELS[state.languageId]} parser is not available yet</h3>
  <p>This tab is reserved for upcoming language support.</p>
  <pre class="plain-code"><code>${escapeHtml(state.code)}</code></pre>
</div>`
  }

  try {
    return await highlighter.codeToHtml(state.code, {
      lang: state.languageId,
      lineClassPrefix: `${state.languageId}-line-`
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return `<div class="placeholder error">
  <h3>Render failed</h3>
  <p>${escapeHtml(message)}</p>
</div>`
  }
}

export const mountDemoApp = (container: HTMLElement): void => {
  const state: DemoState = {
    themeId: THEME_LIST[0]?.id ?? 'dark-plus',
    languageId: 'javascript',
    code: LANGUAGE_SNIPPETS.javascript
  }
  const highlighter = createHighlighter({ theme: state.themeId })
  let renderVersion = 0

  const render = async (): Promise<void> => {
    const currentVersion = ++renderVersion
    const currentTheme =
      THEME_LIST.find((theme) => theme.id === state.themeId) ?? THEME_LIST[0]
    const supportLabel = isLanguageSupported(state.languageId)
      ? 'Available'
      : 'Coming soon'
    const previewHtml = await renderPreview(state, highlighter)

    if (currentVersion !== renderVersion) return

    container.innerHTML = `<div class="demo-shell">
  <header class="hero">
    <h1>Coder Mate Language Playground</h1>
    <p>Try syntax tokenization and theme rendering with createHighlighter.</p>
  </header>

  <section class="control-grid">
    <article class="panel">
      <h2>TabPane - Theme</h2>
      <div class="tabs" role="tablist">${renderThemeTabs(state)}</div>
      <p class="hint">Current theme: <strong>${currentTheme?.displayName ?? 'Dark+'}</strong></p>
    </article>

    <article class="panel">
      <h2>TabPane - Language</h2>
      <div class="tabs" role="tablist">${renderLanguageTabs(state)}</div>
      <p class="hint">Current language: <strong>${LANGUAGE_LABELS[state.languageId]}</strong> - ${supportLabel}</p>
    </article>
  </section>

  <section class="workspace">
    <article class="editor-card">
      <label for="code-input">Code Input</label>
      <textarea id="code-input" spellcheck="false">${escapeHtml(state.code)}</textarea>
    </article>

    <article class="preview-card">
      <div class="preview-title">Preview</div>
      <div class="preview-body">${previewHtml}</div>
    </article>
  </section>
</div>`

    const textarea = container.querySelector<HTMLTextAreaElement>('#code-input')
    if (textarea) {
      textarea.addEventListener('input', () => {
        state.code = textarea.value
        void render()
      })
    }

    const themeButtons = container.querySelectorAll<HTMLButtonElement>(
      '[data-role="theme-tab"]'
    )
    themeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const nextTheme = button.dataset.theme as ThemeId | undefined
        if (!nextTheme || nextTheme === state.themeId) return

        state.themeId = nextTheme
        void (async () => {
          await highlighter.updateTheme(nextTheme)
          await render()
        })()
      })
    })

    const languageButtons = container.querySelectorAll<HTMLButtonElement>(
      '[data-role="language-tab"]'
    )
    languageButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const nextLanguage = button.dataset.language as LanguageId | undefined
        if (!nextLanguage || nextLanguage === state.languageId) return

        state.languageId = nextLanguage
        state.code = LANGUAGE_SNIPPETS[nextLanguage]
        void render()
      })
    })
  }

  void render()
}
