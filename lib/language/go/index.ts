import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { GO_LANGUAGE_META } from './spec'

export const goLanguage: LanguageAdapter = {
  id: GO_LANGUAGE_META.id,
  aliases: [...GO_LANGUAGE_META.aliases],
  parse
}

export { parse }
