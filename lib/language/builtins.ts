import type { LanguageAdapter } from '../core/registry'
import { javascriptLanguage } from './javascript'
import { jsonLanguage } from './json'
import { pythonLanguage } from './python'

/**
 * 内置语言列表
 */
export const BUILTIN_LANGUAGES: LanguageAdapter[] = [
  javascriptLanguage,
  jsonLanguage,
  pythonLanguage
]
