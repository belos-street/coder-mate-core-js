import type { HighlightTheme } from './types'

/**
 * VS Code Dark+ 风格主题
 */
export const darkPlusTheme: HighlightTheme = {
  id: 'dark-plus',
  displayName: 'Dark+',
  defaultStyle: 'color: #D4D4D4;',
  preStyle:
    "background: #1E1E1E; padding: 16px; border-radius: 8px; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.5; white-space: pre;",
  styles: {
    'comment.line.double-slash.js': 'color: #6A9955;',
    'comment.block.js': 'color: #6A9955; font-style: italic;',

    'keyword.control.js': 'color: #569CD6;',
    'keyword.control.async.js': 'color: #C586C0;',
    'keyword.control.class.js': 'color: #569CD6; font-weight: bold;',
    'keyword.control.module.js': 'color: #569CD6;',
    'keyword.control.import.js': 'color: #569CD6;',
    'keyword.declaration.js': 'color: #569CD6;',

    'constant.language.boolean.js': 'color: #569CD6;',
    'constant.language.null.js': 'color: #569CD6;',
    'constant.language.js': 'color: #569CD6;',
    'constant.numeric.js': 'color: #B5CEA8;',
    'constant.language.boolean.json': 'color: #569CD6;',
    'constant.language.null.json': 'color: #569CD6;',
    'constant.numeric.json': 'color: #B5CEA8;',
    'variable.language.global-this.js': 'color: #C586C0; font-weight: bold;',

    'string.quoted.double.js': 'color: #CE9178;',
    'string.quoted.single.js': 'color: #CE9178;',
    'string.quoted.backtick.js': 'color: #CE9178;',
    'string.quoted.double.json': 'color: #CE9178;',

    'operator.js': 'color: #D4D4D4;',
    'operator.optional-chaining.js': 'color: #DCDCAA; font-weight: bold;',
    'operator.nullish-coalescing.js': 'color: #DCDCAA; font-weight: bold;',
    'operator.arrow-function.js': 'color: #DCDCAA;',

    'punctuation.definition.template-expression.js': 'color: #C586C0;',
    'punctuation.separator.key-value.json': 'color: #D4D4D4;',
    'punctuation.separator.value.json': 'color: #D4D4D4;',
    'meta.structure.dictionary.json': 'color: #D4D4D4;',
    'meta.structure.array.json': 'color: #D4D4D4;',

    'variable.identifier.js': 'color: #9CDCFE;',
    'support.function.promise.js': 'color: #DCDCAA; font-weight: bold;',

    default: 'color: #D4D4D4;'
  }
}
