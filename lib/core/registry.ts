import type { TokenStream } from './types'

export interface LanguageAdapter {
  id: string
  aliases?: string[]
  parse: (code: string) => TokenStream
}

const languageRegistry = new Map<string, LanguageAdapter>()

const normalizeLanguageId = (languageId: string): string =>
  languageId.trim().toLowerCase()

const ensureValidLanguageId = (languageId: string): string => {
  const normalized = normalizeLanguageId(languageId)
  if (!normalized) {
    throw new Error('Language id cannot be empty')
  }
  return normalized
}

export const registerLanguage = (language: LanguageAdapter): void => {
  const canonicalId = ensureValidLanguageId(language.id)
  const keys = [canonicalId, ...(language.aliases ?? []).map(ensureValidLanguageId)]

  for (const key of keys) {
    const existing = languageRegistry.get(key)
    if (existing && existing !== language) {
      throw new Error(`Language id or alias "${key}" is already registered`)
    }
  }

  for (const key of keys) {
    languageRegistry.set(key, language)
  }
}

export const getLanguage = (languageId: string): LanguageAdapter | undefined => {
  const normalized = ensureValidLanguageId(languageId)
  return languageRegistry.get(normalized)
}

export const listLanguages = (): LanguageAdapter[] => {
  const seen = new Set<string>()
  const languages: LanguageAdapter[] = []

  for (const language of languageRegistry.values()) {
    const key = normalizeLanguageId(language.id)
    if (seen.has(key)) continue
    seen.add(key)
    languages.push(language)
  }

  return languages
}

export const tokenize = (code: string, languageId: string): TokenStream => {
  const language = getLanguage(languageId)
  if (!language) {
    throw new Error(`Language "${languageId}" is not registered`)
  }
  return language.parse(code)
}

/**
 * 测试用途：重置注册表
 */
export const clearRegistry = (): void => {
  languageRegistry.clear()
}
