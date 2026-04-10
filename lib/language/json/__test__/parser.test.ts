import { describe, expect, test } from 'bun:test'
import { parse } from '../index'

describe('JSON 解析测试', () => {
  test('对象与数组基础 token', () => {
    const code = `{
  "name": "coder-mate",
  "count": 3,
  "active": true,
  "meta": null,
  "items": [1, 2]
}`
    const rows = parse(code)
    const tokens = rows.flat()

    expect(rows.length).toBeGreaterThan(0)
    expect(tokens.some((t) => t.scope === 'meta.structure.dictionary.json')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'meta.structure.array.json')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.double.json')).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.numeric.json')).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'constant.language.boolean.json')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.language.null.json')).toBe(
      true
    )
    expect(
      tokens.some((t) => t.scope === 'punctuation.separator.key-value.json')
    ).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'punctuation.separator.value.json')
    ).toBe(true)
  })

  test('数字支持负号和科学计数法', () => {
    const code = `{"a": -12.5e+2, "b": 0, "c": 1.23E-4}`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.text === '-12.5e+2')).toBe(true)
    expect(tokens.some((t) => t.text === '0')).toBe(true)
    expect(tokens.some((t) => t.text === '1.23E-4')).toBe(true)
  })
})
