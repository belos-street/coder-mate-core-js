import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { CSHARP_LANGUAGE_META } from './spec'

export const csharpLanguage: LanguageAdapter = {
  id: CSHARP_LANGUAGE_META.id,
  aliases: [...CSHARP_LANGUAGE_META.aliases],
  parse
}

export { parse }
