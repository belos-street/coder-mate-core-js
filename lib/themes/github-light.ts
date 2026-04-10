import type { HighlightTheme } from './types'

/**
 * GitHub Light 风格主题
 */
export const githubLightTheme: HighlightTheme = {
  id: 'github-light',
  displayName: 'GitHub Light',
  defaultStyle: 'color: #24292F;',
  preStyle:
    "background: #FFFFFF; color: #24292F; border: 1px solid #D0D7DE; padding: 16px; border-radius: 8px; font-family: 'SFMono-Regular', 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.5; white-space: pre;",
  styles: {
    'comment.line.double-slash.js': 'color: #6A737D; font-style: italic;',
    'comment.block.js': 'color: #6A737D; font-style: italic;',

    'keyword.control.js': 'color: #D73A49;',
    'keyword.control.async.js': 'color: #6F42C1;',
    'keyword.control.class.js': 'color: #D73A49; font-weight: bold;',
    'keyword.control.module.js': 'color: #D73A49;',
    'keyword.control.import.js': 'color: #D73A49;',
    'keyword.declaration.js': 'color: #D73A49;',

    'constant.language.boolean.js': 'color: #005CC5;',
    'constant.language.null.js': 'color: #005CC5;',
    'constant.language.js': 'color: #005CC5;',
    'constant.numeric.js': 'color: #005CC5;',
    'constant.language.boolean.json': 'color: #005CC5;',
    'constant.language.null.json': 'color: #005CC5;',
    'constant.numeric.json': 'color: #005CC5;',
    'variable.language.global-this.js': 'color: #6F42C1; font-weight: bold;',

    'string.quoted.double.js': 'color: #032F62;',
    'string.quoted.single.js': 'color: #032F62;',
    'string.quoted.backtick.js': 'color: #032F62;',
    'string.quoted.double.json': 'color: #032F62;',

    'operator.js': 'color: #24292F;',
    'operator.optional-chaining.js': 'color: #B08800; font-weight: bold;',
    'operator.nullish-coalescing.js': 'color: #B08800; font-weight: bold;',
    'operator.arrow-function.js': 'color: #B08800;',

    'punctuation.definition.template-expression.js': 'color: #6F42C1;',
    'punctuation.separator.key-value.json': 'color: #24292F;',
    'punctuation.separator.value.json': 'color: #24292F;',
    'meta.structure.dictionary.json': 'color: #24292F;',
    'meta.structure.array.json': 'color: #24292F;',

    'variable.identifier.js': 'color: #24292F;',
    'support.function.promise.js': 'color: #6F42C1; font-weight: bold;',

    default: 'color: #24292F;'
  }
}
