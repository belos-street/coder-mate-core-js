import type { LanguageAdapter } from '../core/registry'
import { htmlLanguage } from './html'
import { javascriptLanguage } from './javascript'
import { jsonLanguage } from './json'
import { pythonLanguage } from './python'
import { typescriptLanguage } from './typescript'

/**
 * 内置语言列表
 */
export const BUILTIN_LANGUAGES: LanguageAdapter[] = [
  javascriptLanguage,
  typescriptLanguage,
  htmlLanguage,
  jsonLanguage,
  pythonLanguage
]
