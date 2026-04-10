import {
  clearRegistry,
  getLanguage as getLanguageCore,
  listLanguages as listLanguagesCore,
  registerLanguage as registerLanguageCore,
  tokenize as tokenizeCore
} from '../core/registry'
import { BUILTIN_LANGUAGES } from './builtins'

let builtinsRegistered = false

export const registerBuiltinLanguages = (): void => {
  if (builtinsRegistered) return

  for (const language of BUILTIN_LANGUAGES) {
    registerLanguageCore(language)
  }

  builtinsRegistered = true
}

const ensureBuiltinsRegistered = (): void => {
  if (!builtinsRegistered) {
    registerBuiltinLanguages()
  }
}

export const registerLanguage = registerLanguageCore

export const getLanguage = (languageId: string) => {
  ensureBuiltinsRegistered()
  return getLanguageCore(languageId)
}

export const listLanguages = () => {
  ensureBuiltinsRegistered()
  return listLanguagesCore()
}

export const tokenize = (code: string, languageId: string) => {
  ensureBuiltinsRegistered()
  return tokenizeCore(code, languageId)
}

export const resetLanguageRegistryForTest = (): void => {
  clearRegistry()
  builtinsRegistered = false
}

// 模块加载时默认注册内置语言，避免延迟注册造成行为不一致
registerBuiltinLanguages()
