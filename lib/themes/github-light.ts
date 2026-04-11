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
    'comment.line.number-sign.python': 'color: #6A737D; font-style: italic;',
    'comment.block.html': 'color: #6A737D; font-style: italic;',

    'keyword.control.js': 'color: #D73A49;',
    'keyword.control.async.js': 'color: #6F42C1;',
    'keyword.control.class.js': 'color: #D73A49; font-weight: bold;',
    'keyword.control.module.js': 'color: #D73A49;',
    'keyword.control.import.js': 'color: #D73A49;',
    'keyword.declaration.js': 'color: #D73A49;',
    'keyword.declaration.type.typescript': 'color: #D73A49; font-weight: bold;',
    'keyword.modifier.access.typescript': 'color: #005CC5;',
    'keyword.operator.assertion.typescript': 'color: #6F42C1;',
    'keyword.operator.type.typescript': 'color: #6F42C1;',
    'keyword.control.python': 'color: #D73A49;',
    'keyword.declaration.python': 'color: #D73A49; font-weight: bold;',
    'entity.name.function.python': 'color: #6F42C1;',
    'entity.name.class.python': 'color: #005CC5;',
    'support.function.builtin.python': 'color: #6F42C1; font-weight: bold;',
    'support.type.annotation.python': 'color: #005CC5;',
    'meta.decorator.python': 'color: #6F42C1;',
    'keyword.control.doctype.html': 'color: #6F42C1;',

    'constant.language.boolean.js': 'color: #005CC5;',
    'constant.language.null.js': 'color: #005CC5;',
    'constant.language.js': 'color: #005CC5;',
    'constant.numeric.js': 'color: #005CC5;',
    'constant.language.boolean.json': 'color: #005CC5;',
    'constant.language.null.json': 'color: #005CC5;',
    'constant.numeric.json': 'color: #005CC5;',
    'constant.language.boolean.python': 'color: #005CC5;',
    'constant.language.none.python': 'color: #005CC5;',
    'constant.numeric.python': 'color: #005CC5;',
    'variable.language.global-this.js': 'color: #6F42C1; font-weight: bold;',
    'support.type.builtin.typescript': 'color: #005CC5;',

    'string.quoted.double.js': 'color: #032F62;',
    'string.quoted.single.js': 'color: #032F62;',
    'string.quoted.backtick.js': 'color: #032F62;',
    'string.quoted.double.json': 'color: #032F62;',
    'string.quoted.double.python': 'color: #032F62;',
    'string.quoted.single.python': 'color: #032F62;',
    'string.quoted.double.triple.python': 'color: #032F62;',
    'string.quoted.single.triple.python': 'color: #032F62;',
    'string.interpolated.python': 'color: #032F62;',
    'string.quoted.double.html': 'color: #032F62;',
    'string.quoted.single.html': 'color: #032F62;',
    'string.unquoted.html': 'color: #032F62;',

    'operator.js': 'color: #24292F;',
    'operator.optional-chaining.js': 'color: #B08800; font-weight: bold;',
    'operator.nullish-coalescing.js': 'color: #B08800; font-weight: bold;',
    'operator.arrow-function.js': 'color: #B08800;',
    'operator.python': 'color: #24292F;',

    'punctuation.definition.template-expression.js': 'color: #6F42C1;',
    'punctuation.separator.key-value.json': 'color: #24292F;',
    'punctuation.separator.value.json': 'color: #24292F;',
    'meta.structure.dictionary.json': 'color: #24292F;',
    'meta.structure.array.json': 'color: #24292F;',
    'punctuation.definition.interpolation.begin.python': 'color: #6F42C1;',
    'punctuation.definition.interpolation.end.python': 'color: #6F42C1;',
    'punctuation.format.fstring.python': 'color: #B08800;',
    'punctuation.definition.tag.begin.html': 'color: #24292F;',
    'punctuation.definition.tag.end.html': 'color: #24292F;',
    'punctuation.separator.key-value.html': 'color: #24292F;',

    'variable.identifier.js': 'color: #24292F;',
    'entity.name.type.typescript': 'color: #005CC5;',
    'entity.name.tag.html': 'color: #22863A;',
    'entity.other.attribute-name.html': 'color: #005CC5;',
    'variable.alias.python': 'color: #005CC5; font-style: italic;',
    'variable.comprehension.python': 'color: #24292F;',
    'variable.identifier.python': 'color: #24292F;',
    'support.function.promise.js': 'color: #6F42C1; font-weight: bold;',
    'constant.character.entity.html': 'color: #B08800;',
    'text.plain.html': 'color: #24292F;',

    default: 'color: #24292F;'
  }
}
