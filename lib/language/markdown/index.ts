import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { MARKDOWN_LANGUAGE_META } from './spec'

export const markdownLanguage: LanguageAdapter = {
  id: MARKDOWN_LANGUAGE_META.id,
  aliases: [...MARKDOWN_LANGUAGE_META.aliases],
  parse
}

export { parse }
