import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { BASH_LANGUAGE_META } from './spec'

export const bashLanguage: LanguageAdapter = {
  id: BASH_LANGUAGE_META.id,
  aliases: [...BASH_LANGUAGE_META.aliases],
  parse
}

export { parse }
