import type { LanguageAdapter } from '../core/registry'
import { javascriptLanguage } from './javascript'
import { jsonLanguage } from './json'

/**
 * 内置语言列表
 */
export const BUILTIN_LANGUAGES: LanguageAdapter[] = [
  javascriptLanguage,
  jsonLanguage
]
