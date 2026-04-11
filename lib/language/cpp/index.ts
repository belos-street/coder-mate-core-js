import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { CPP_LANGUAGE_META } from './spec'

export const cppLanguage: LanguageAdapter = {
  id: CPP_LANGUAGE_META.id,
  aliases: [...CPP_LANGUAGE_META.aliases],
  parse
}

export { parse }
