import { describe, expect, test } from 'bun:test'
import { parse } from '../index'

describe('HTML 解析测试', () => {
  test('基础标签、属性、文本与实体', () => {
    const code = `<!DOCTYPE html>
<div class="app" data-id='42' hidden>Hello&nbsp;<span>World</span></div>`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'keyword.control.doctype.html')).toBe(
      true
    )
    expect(
      tokens.some((t) => t.scope === 'punctuation.definition.tag.begin.html')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.tag.html')).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'entity.other.attribute-name.html')
    ).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'punctuation.separator.key-value.html')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.double.html')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.single.html')).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'constant.character.entity.html')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'text.plain.html')).toBe(true)
  })

  test('支持注释与多行注释', () => {
    const code = `<!-- block
comment -->
<p>ok</p>`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'comment.block.html')).toBe(true)
    expect(tokens.some((t) => t.text === 'p')).toBe(true)
  })

  test('支持无引号属性与自闭合标签', () => {
    const code = `<input type=text disabled/>`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'string.unquoted.html')).toBe(true)
    expect(
      tokens.some((t) => t.text === '/>' && t.scope === 'punctuation.definition.tag.end.html')
    ).toBe(true)
  })

  test('未闭合注释不应崩溃', () => {
    const code = `<!-- not closed
<div>text</div>`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(tokens.some((t) => t.scope === 'comment.block.html')).toBe(true)
  })

  test('行号追踪正确', () => {
    const code = `<div>
  <span>text</span>
</div>`
    const tokens = parse(code).flat()
    const spanToken = tokens.find((t) => t.text === 'span')

    expect(spanToken?.line).toBe(2)
  })
})
