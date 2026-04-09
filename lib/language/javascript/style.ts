import type { ScopeStyleMap } from './type'

/**
 * Scope 到 CSS 样式的映射表
 * 参考 VS Code Dark+ 主题配色
 */
export const SCOPE_TO_STYLE: ScopeStyleMap = {
  // 注释样式（绿色斜体）
  'comment.line.double-slash.js': 'color: #6A9955;',
  'comment.block.js': 'color: #6A9955; font-style: italic;',

  // 关键字样式（蓝色）
  'keyword.control.js': 'color: #569CD6;',
  'keyword.control.async.js': 'color: #C586C0;',
  'keyword.control.class.js': 'color: #569CD6; font-weight: bold;',
  'keyword.control.module.js': 'color: #569CD6;',
  'keyword.control.import.js': 'color: #569CD6;',
  'keyword.declaration.js': 'color: #569CD6;',

  // 常量/值样式
  'constant.language.boolean.js': 'color: #569CD6;',
  'constant.language.null.js': 'color: #569CD6;',
  'constant.language.js': 'color: #569CD6;',
  'constant.numeric.js': 'color: #B5CEA8;',
  'variable.language.global-this.js': 'color: #C586C0; font-weight: bold;',

  // 字符串样式（橙色）
  'string.quoted.double.js': 'color: #CE9178;',
  'string.quoted.single.js': 'color: #CE9178;',
  'string.quoted.backtick.js': 'color: #CE9178;',

  // 运算符样式
  'operator.js': 'color: #D4D4D4;',
  'operator.optional-chaining.js': 'color: #DCDCAA; font-weight: bold;',
  'operator.nullish-coalescing.js': 'color: #DCDCAA; font-weight: bold;',
  'operator.arrow-function.js': 'color: #DCDCAA;',

  // 模板插值样式
  'punctuation.definition.template-expression.js': 'color: #C586C0;',

  // 标识符/函数样式
  'variable.identifier.js': 'color: #9CDCFE;',
  'support.function.promise.js': 'color: #DCDCAA; font-weight: bold;',

  // 默认样式
  'default': 'color: #D4D4D4;'
}
