import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { RUST_LANGUAGE_META } from './spec'

export const rustLanguage: LanguageAdapter = {
  id: RUST_LANGUAGE_META.id,
  aliases: [...RUST_LANGUAGE_META.aliases],
  parse
}

export { parse }
