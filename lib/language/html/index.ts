import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { HTML_LANGUAGE_META } from './spec'

export const htmlLanguage: LanguageAdapter = {
  id: HTML_LANGUAGE_META.id,
  aliases: [...HTML_LANGUAGE_META.aliases],
  parse
}

export { parse }
