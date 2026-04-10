import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { PYTHON_LANGUAGE_META } from './spec'

export const pythonLanguage: LanguageAdapter = {
  id: PYTHON_LANGUAGE_META.id,
  aliases: [...PYTHON_LANGUAGE_META.aliases],
  parse
}

export { parse }
