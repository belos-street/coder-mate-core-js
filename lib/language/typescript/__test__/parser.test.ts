import { describe, expect, test } from 'bun:test'
import { parse } from '../index'

describe('TypeScript parser', () => {
  test('highlights TS declaration keywords and modifiers', () => {
    const code = `interface User {
  readonly id: number
}

type UserId = string | number

enum Status {
  Active = "active"
}

class UserService implements User {
  public id: number = 1
  private name: string = "coder"
  protected status: Status = Status.Active
}`

    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'keyword.declaration.type.typescript')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'keyword.modifier.access.typescript')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'support.type.builtin.typescript')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'entity.name.type.typescript')).toBe(true)
  })

  test('supports as assertion and basic generics', () => {
    const code = `const value = input as number

function wrap<T>(item: T): Promise<T> {
  return Promise.resolve(item)
}`

    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'keyword.operator.assertion.typescript')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'entity.name.type.typescript')).toBe(true)
    expect(tokens.some((t) => t.scope === 'support.type.builtin.typescript')).toBe(
      true
    )
  })

  test('keeps JavaScript baseline scopes available', () => {
    const code = `// comment
const message = \`hello \${name}\`
const result = source?.value ?? 42`

    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'comment.line.double-slash.js')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.backtick.js')).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'punctuation.definition.template-expression.js')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'operator.optional-chaining.js')).toBe(true)
    expect(tokens.some((t) => t.scope === 'operator.nullish-coalescing.js')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'constant.numeric.js')).toBe(true)
  })

  test('does not crash on incomplete type syntax', () => {
    const code = `type Broken<T = { value: string`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
  })

  test('supports import/export type and type operators', () => {
    const code = `import type { User } from "./model"
export type ID = string | number

type Status = "ready" | "error"
const ok = source satisfies Record<string, unknown>

type ValueOf<T> = T[keyof T]
type Factory<T> = T extends Promise<infer R> ? R : T

function isUser(value: unknown): value is User {
  return typeof value === "object"
}`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'keyword.control.module.js')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.declaration.type.typescript')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'keyword.operator.type.typescript')).toBe(
      true
    )
    expect(
      tokens.some(
        (t) => t.text === 'extends' && t.scope === 'keyword.operator.type.typescript'
      )
    ).toBe(true)
    expect(tokens.some((t) => t.text === '|' && t.scope === 'operator.js')).toBe(true)
    expect(tokens.some((t) => t.text === '?' && t.scope === 'operator.js')).toBe(true)
  })

  test('distinguishes class extends from type-level extends', () => {
    const code = `class Store<T extends object> extends BaseStore<T> {
  value!: T
}

type Resolve<T> = T extends Promise<infer R> ? R : T`
    const tokens = parse(code).flat()

    expect(
      tokens.some((t) => t.text === 'extends' && t.scope === 'keyword.control.class.js')
    ).toBe(true)
    expect(
      tokens.some(
        (t) => t.text === 'extends' && t.scope === 'keyword.operator.type.typescript'
      )
    ).toBe(true)
  })

  test('supports mapped types and tuple rest types', () => {
    const code = `type ReadonlyPick<T, K extends keyof T> = {
  readonly [P in K]?: T[P]
}

type Pair = [head: string, ...tail: number[]]`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'keyword.modifier.access.typescript')).toBe(
      true
    )
    expect(tokens.some((t) => t.text === 'in' && t.scope === 'keyword.operator.type.typescript')).toBe(
      true
    )
    expect(tokens.some((t) => t.text === '...' && t.scope === 'operator.js')).toBe(
      true
    )
  })

  test('supports as const and non-null assertion tokens', () => {
    const code = `const config = { mode: "prod" } as const
const label = user!.profile?.name ?? "unknown"`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.text === 'as' && t.scope === 'keyword.operator.assertion.typescript')).toBe(
      true
    )
    expect(tokens.some((t) => t.text === '!' && t.scope === 'operator.js')).toBe(true)
    expect(tokens.some((t) => t.scope === 'operator.optional-chaining.js')).toBe(true)
  })

  test('closes template-literal type interpolation before later nullish operator', () => {
    const code = `type EventName<T extends string> = \`on\${Capitalize<T>}\`
type Next = { value: number }
const city = profile?.address?.city ?? "Unknown"`
    const rows = parse(code)
    const templateLine = rows[0] ?? []
    const nextTypeLine = rows[1] ?? []
    const nullishLine = rows[2] ?? []

    expect(
      templateLine.some(
        (t) => t.scope === 'punctuation.definition.template-expression.js'
      )
    ).toBe(true)
    expect(
      nextTypeLine.some(
        (t) =>
          t.text === 'type' && t.scope === 'keyword.declaration.type.typescript'
      )
    ).toBe(true)
    expect(
      nextTypeLine.some((t) => t.scope === 'string.quoted.backtick.js')
    ).toBe(false)
    expect(
      nullishLine.some((t) => t.scope === 'operator.optional-chaining.js')
    ).toBe(true)
    expect(
      nullishLine.some((t) => t.scope === 'operator.nullish-coalescing.js')
    ).toBe(true)
  })
})
