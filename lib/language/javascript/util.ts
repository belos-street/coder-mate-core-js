/**
 * ES2020 语法高亮器 - 工具函数
 */

/**
 * HTML 特殊字符转义
 * 避免XSS攻击和渲染异常
 * 
 * @param text 原始文本
 * @returns 转义后的文本
 * 
 * @example
 * escapeHtml('<div>') // '&lt;div&gt;'
 * escapeHtml('a & b') // 'a &amp; b'
 */
export const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;')
    .replace(/\$/g, '&#36;')
    .replace(/\t/g, '&#9;')
}
