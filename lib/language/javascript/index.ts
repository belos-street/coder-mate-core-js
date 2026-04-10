import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { JAVASCRIPT_LANGUAGE_META } from './spec'

export const javascriptLanguage: LanguageAdapter = {
  id: JAVASCRIPT_LANGUAGE_META.id,
  aliases: [...JAVASCRIPT_LANGUAGE_META.aliases],
  parse
}

export { parse }
