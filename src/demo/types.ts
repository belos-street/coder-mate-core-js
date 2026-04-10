export const LANGUAGE_ORDER = ['javascript', 'json', 'python'] as const

export type LanguageId = (typeof LANGUAGE_ORDER)[number]

export interface DemoState {
  themeId: string
  languageId: LanguageId
  code: string
}
