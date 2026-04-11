import { describe, expect, test } from 'bun:test'
import { parse } from '../index'

describe('CSS 解析测试', () => {
  test('基础选择器与声明 token', () => {
    const code = `.card:hover::before, #app[data-theme="dark"] {
  color: #1f2937;
  margin: 12px 8px;
  --brand-color: #2563eb;
}`
    const tokens = parse(code).flat()

    expect(
      tokens.some((t) => t.scope === 'entity.other.attribute-name.class.css')
    ).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'entity.other.attribute-name.id.css')
    ).toBe(true)
    expect(
      tokens.some(
        (t) => t.scope === 'entity.other.attribute-name.pseudo-class.css'
      )
    ).toBe(true)
    expect(
      tokens.some(
        (t) => t.scope === 'entity.other.attribute-name.pseudo-element.css'
      )
    ).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'punctuation.section.block.begin.css')
    ).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'punctuation.section.block.end.css')
    ).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'support.type.property-name.css')
    ).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'variable.parameter.custom-property.css')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.other.color.hex.css')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'constant.numeric.css')).toBe(true)
  })

  test('支持注释、at-rule、函数与 important', () => {
    const code = `/* reset */
@media screen and (min-width: 768px) {
  .box {
    width: calc(100% - 24px);
    background-image: linear-gradient(90deg, #fff, #000);
    color: rgba(0, 0, 0, 0.85) !important;
  }
}`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'comment.block.css')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.control.at-rule.css')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'support.function.css')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.other.important.css')).toBe(
      true
    )
  })

  test('未闭合注释和字符串不应崩溃', () => {
    const code = `.title { content: "hello
/* not closed`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(
      tokens.some(
        (t) =>
          t.scope === 'string.quoted.double.css' ||
          t.scope === 'comment.block.css'
      )
    ).toBe(true)
  })

  test('行号追踪正确', () => {
    const code = `.a {
  color: red;
  width: 10px;
}`
    const tokens = parse(code).flat()
    const widthToken = tokens.find((t) => t.text === 'width')

    expect(widthToken?.line).toBe(3)
    expect(widthToken?.scope).toBe('support.type.property-name.css')
  })
})
