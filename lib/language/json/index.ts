import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { JSON_LANGUAGE_META } from './spec'

export const jsonLanguage: LanguageAdapter = {
  id: JSON_LANGUAGE_META.id,
  aliases: [...JSON_LANGUAGE_META.aliases],
  parse
}

export { parse }
