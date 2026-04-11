import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { C_LANGUAGE_META } from './spec'

export const cLanguage: LanguageAdapter = {
  id: C_LANGUAGE_META.id,
  aliases: [...C_LANGUAGE_META.aliases],
  parse
}

export { parse }
