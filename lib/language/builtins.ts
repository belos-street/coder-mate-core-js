import type { LanguageAdapter } from '../core/registry'
import { bashLanguage } from './bash'
import { cLanguage } from './c'
import { cppLanguage } from './cpp'
import { csharpLanguage } from './csharp'
import { cssLanguage } from './css'
import { goLanguage } from './go'
import { htmlLanguage } from './html'
import { javascriptLanguage } from './javascript'
import { javaLanguage } from './java'
import { jsonLanguage } from './json'
import { markdownLanguage } from './markdown'
import { phpLanguage } from './php'
import { pythonLanguage } from './python'
import { rustLanguage } from './rust'
import { sqlLanguage } from './sql'
import { typescriptLanguage } from './typescript'
import { yamlLanguage } from './yaml'

/**
 * 内置语言列表
 */
export const BUILTIN_LANGUAGES: LanguageAdapter[] = [
  javascriptLanguage,
  typescriptLanguage,
  cssLanguage,
  bashLanguage,
  sqlLanguage,
  yamlLanguage,
  markdownLanguage,
  javaLanguage,
  cLanguage,
  cppLanguage,
  csharpLanguage,
  goLanguage,
  rustLanguage,
  phpLanguage,
  htmlLanguage,
  jsonLanguage,
  pythonLanguage
]
