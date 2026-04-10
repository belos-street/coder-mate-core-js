import { listLanguages, tokenize } from 'lib/language'
import { getTheme, listThemes } from 'lib/themes'
import { escapeHtml, renderHtml } from '../render'
import { LANGUAGE_LABELS, LANGUAGE_SNIPPETS } from './languages'
import { LANGUAGE_ORDER, type DemoState, type LanguageId } from './types'

const builtinLanguages = new Set(listLanguages().map((language) => language.id))
const themeList = listThemes()

const isLanguageSupported = (languageId: LanguageId): boolean =>
  builtinLanguages.has(languageId)

const renderThemeTabs = (state: DemoState): string =>
  themeList
    .map((theme) => {
      const activeClass = theme.id === state.themeId ? 'is-active' : ''
      return `<button class="tab-btn ${activeClass}" data-role="theme-tab" data-theme="${theme.id}" title="${theme.displayName}">
  <span>${theme.displayName}</span>
</button>`
    })
    .join('')

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

const renderPreview = (state: DemoState): string => {
  if (!isLanguageSupported(state.languageId)) {
    return `<div class="placeholder">
  <h3>${LANGUAGE_LABELS[state.languageId]} 解析器尚未接入</h3>
  <p>核心引擎已支持多语言注册，这里先保留 Tab 结构，后续接入语言后可直接展示。</p>
  <pre class="plain-code"><code>${escapeHtml(state.code)}</code></pre>
</div>`
  }

  try {
    const rows = tokenize(state.code, state.languageId)
    return renderHtml(rows, {
      theme: state.themeId,
      lineClassPrefix: `${state.languageId}-line-`
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return `<div class="placeholder error">
  <h3>渲染失败</h3>
  <p>${escapeHtml(message)}</p>
</div>`
  }
}

export const mountDemoApp = (container: HTMLElement): void => {
  const state: DemoState = {
    themeId: themeList[0]?.id ?? 'dark-plus',
    languageId: 'javascript',
    code: LANGUAGE_SNIPPETS.javascript
  }

  const render = (): void => {
    const currentTheme = getTheme(state.themeId)
    const supportLabel = isLanguageSupported(state.languageId) ? '可用' : '未接入'

    container.innerHTML = `<div class="demo-shell">
  <header class="hero">
    <h1>Coder Mate Language Playground</h1>
    <p>用同一套核心引擎测试语言分词和主题映射，先把 Demo 交互结构搭好。</p>
  </header>

  <section class="control-grid">
    <article class="panel">
      <h2>TabPane - 主题</h2>
      <div class="tabs" role="tablist">${renderThemeTabs(state)}</div>
      <p class="hint">当前主题：<strong>${currentTheme.displayName}</strong></p>
    </article>

    <article class="panel">
      <h2>TabPane - 语言</h2>
      <div class="tabs" role="tablist">${renderLanguageTabs(state)}</div>
      <p class="hint">当前语言：<strong>${LANGUAGE_LABELS[state.languageId]}</strong> · ${supportLabel}</p>
    </article>
  </section>

  <section class="workspace">
    <article class="editor-card">
      <label for="code-input">代码输入</label>
      <textarea id="code-input" spellcheck="false">${escapeHtml(state.code)}</textarea>
    </article>

    <article class="preview-card">
      <div class="preview-title">预览</div>
      <div class="preview-body">${renderPreview(state)}</div>
    </article>
  </section>
</div>`

    const textarea = container.querySelector<HTMLTextAreaElement>('#code-input')
    if (textarea) {
      textarea.addEventListener('input', () => {
        state.code = textarea.value
        render()
      })
    }

    const themeButtons = container.querySelectorAll<HTMLButtonElement>(
      '[data-role="theme-tab"]'
    )
    themeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const nextTheme = button.dataset.theme
        if (!nextTheme || nextTheme === state.themeId) return
        state.themeId = nextTheme
        render()
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
        render()
      })
    })
  }

  render()
}
