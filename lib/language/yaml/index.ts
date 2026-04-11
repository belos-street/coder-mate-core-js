import type { LanguageAdapter } from '../../core/registry'
import { parse } from './engine'
import { YAML_LANGUAGE_META } from './spec'

export const yamlLanguage: LanguageAdapter = {
  id: YAML_LANGUAGE_META.id,
  aliases: [...YAML_LANGUAGE_META.aliases],
  parse
}

export { parse }
