import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { JAVA_LANGUAGE_META } from './spec'

export const javaLanguage: LanguageAdapter = {
  id: JAVA_LANGUAGE_META.id,
  aliases: [...JAVA_LANGUAGE_META.aliases],
  parse
}

export { parse }
