import { describe, expect, test } from 'bun:test'
import { parse } from '../index'

describe('YAML 解析测试', () => {
  test('基础 mapping 与 sequence token', () => {
    const code = `name: coder-mate
version: 1
enabled: true
description: "hello"
items:
  - web
  - api
meta: null`
    const tokens = parse(code).flat()

    expect(
      tokens.some((t) => t.scope === 'support.type.property-name.yaml')
    ).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'punctuation.separator.key-value.yaml')
    ).toBe(true)
    expect(
      tokens.some(
        (t) => t.scope === 'punctuation.definition.sequence.item.yaml'
      )
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.numeric.yaml')).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'constant.language.boolean.yaml')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.language.null.yaml')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'string.quoted.double.yaml')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'string.unquoted.yaml')).toBe(true)
  })

  test('支持注释、文档边界、anchor/alias/tag', () => {
    const code = `---
# app config
defaults: &defaults
  role: !user admin
profile:
  ref: *defaults
...
`
    const tokens = parse(code).flat()

    expect(
      tokens.some((t) => t.scope === 'keyword.control.document.begin.yaml')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'comment.line.number-sign.yaml')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'entity.name.tag.anchor.yaml')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'variable.other.alias.yaml')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'entity.name.tag.yaml')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.control.document.end.yaml')).toBe(
      true
    )
  })

  test('未闭合字符串不应崩溃', () => {
    const code = `name: "coder
title: 'mate`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(
      tokens.some(
        (t) =>
          t.scope === 'string.quoted.double.yaml' ||
          t.scope === 'string.quoted.single.yaml'
      )
    ).toBe(true)
  })

  test('行号追踪正确', () => {
    const code = `service:
  name: api
  replicas: 3`
    const tokens = parse(code).flat()
    const replicasToken = tokens.find((t) => t.text === 'replicas')

    expect(replicasToken?.line).toBe(3)
    expect(replicasToken?.scope).toBe('support.type.property-name.yaml')
  })
})
