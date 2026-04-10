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
    'comment.line.number-sign.python': 'color: #6A9955;',

    'keyword.control.js': 'color: #569CD6;',
    'keyword.control.async.js': 'color: #C586C0;',
    'keyword.control.class.js': 'color: #569CD6; font-weight: bold;',
    'keyword.control.module.js': 'color: #569CD6;',
    'keyword.control.import.js': 'color: #569CD6;',
    'keyword.declaration.js': 'color: #569CD6;',
    'keyword.declaration.type.typescript': 'color: #569CD6; font-weight: bold;',
    'keyword.modifier.access.typescript': 'color: #4EC9B0;',
    'keyword.operator.assertion.typescript': 'color: #C586C0;',
    'keyword.operator.type.typescript': 'color: #C586C0;',
    'keyword.control.python': 'color: #569CD6;',
    'keyword.declaration.python': 'color: #569CD6; font-weight: bold;',
    'entity.name.function.python': 'color: #DCDCAA;',
    'entity.name.class.python': 'color: #4EC9B0;',
    'support.function.builtin.python': 'color: #DCDCAA; font-weight: bold;',
    'support.type.annotation.python': 'color: #4EC9B0;',
    'meta.decorator.python': 'color: #C586C0;',

    'constant.language.boolean.js': 'color: #569CD6;',
    'constant.language.null.js': 'color: #569CD6;',
    'constant.language.js': 'color: #569CD6;',
    'constant.numeric.js': 'color: #B5CEA8;',
    'constant.language.boolean.json': 'color: #569CD6;',
    'constant.language.null.json': 'color: #569CD6;',
    'constant.numeric.json': 'color: #B5CEA8;',
    'constant.language.boolean.python': 'color: #569CD6;',
    'constant.language.none.python': 'color: #569CD6;',
    'constant.numeric.python': 'color: #B5CEA8;',
    'variable.language.global-this.js': 'color: #C586C0; font-weight: bold;',
    'support.type.builtin.typescript': 'color: #4EC9B0;',

    'string.quoted.double.js': 'color: #CE9178;',
    'string.quoted.single.js': 'color: #CE9178;',
    'string.quoted.backtick.js': 'color: #CE9178;',
    'string.quoted.double.json': 'color: #CE9178;',
    'string.quoted.double.python': 'color: #CE9178;',
    'string.quoted.single.python': 'color: #CE9178;',
    'string.quoted.double.triple.python': 'color: #CE9178;',
    'string.quoted.single.triple.python': 'color: #CE9178;',
    'string.interpolated.python': 'color: #CE9178;',

    'operator.js': 'color: #D4D4D4;',
    'operator.optional-chaining.js': 'color: #DCDCAA; font-weight: bold;',
    'operator.nullish-coalescing.js': 'color: #DCDCAA; font-weight: bold;',
    'operator.arrow-function.js': 'color: #DCDCAA;',
    'operator.python': 'color: #D4D4D4;',

    'punctuation.definition.template-expression.js': 'color: #C586C0;',
    'punctuation.separator.key-value.json': 'color: #D4D4D4;',
    'punctuation.separator.value.json': 'color: #D4D4D4;',
    'meta.structure.dictionary.json': 'color: #D4D4D4;',
    'meta.structure.array.json': 'color: #D4D4D4;',
    'punctuation.definition.interpolation.begin.python': 'color: #C586C0;',
    'punctuation.definition.interpolation.end.python': 'color: #C586C0;',
    'punctuation.format.fstring.python': 'color: #D7BA7D;',

    'variable.identifier.js': 'color: #9CDCFE;',
    'entity.name.type.typescript': 'color: #4EC9B0;',
    'variable.alias.python': 'color: #9CDCFE; font-style: italic;',
    'variable.comprehension.python': 'color: #9CDCFE;',
    'variable.identifier.python': 'color: #9CDCFE;',
    'support.function.promise.js': 'color: #DCDCAA; font-weight: bold;',

    default: 'color: #D4D4D4;'
  }
}
