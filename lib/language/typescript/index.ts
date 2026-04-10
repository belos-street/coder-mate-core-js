import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { TYPESCRIPT_LANGUAGE_META } from './spec'

export const typescriptLanguage: LanguageAdapter = {
  id: TYPESCRIPT_LANGUAGE_META.id,
  aliases: [...TYPESCRIPT_LANGUAGE_META.aliases],
  parse
}

export { parse }
