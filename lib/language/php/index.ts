import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { PHP_LANGUAGE_META } from './spec'

export const phpLanguage: LanguageAdapter = {
  id: PHP_LANGUAGE_META.id,
  aliases: [...PHP_LANGUAGE_META.aliases],
  parse
}

export { parse }
