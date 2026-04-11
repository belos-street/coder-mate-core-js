import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { SQL_LANGUAGE_META } from './spec'

export const sqlLanguage: LanguageAdapter = {
  id: SQL_LANGUAGE_META.id,
  aliases: [...SQL_LANGUAGE_META.aliases],
  parse
}

export { parse }
