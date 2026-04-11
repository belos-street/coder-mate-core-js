import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { CSS_LANGUAGE_META } from './spec'

export const cssLanguage: LanguageAdapter = {
  id: CSS_LANGUAGE_META.id,
  aliases: [...CSS_LANGUAGE_META.aliases],
  parse
}

export { parse }
