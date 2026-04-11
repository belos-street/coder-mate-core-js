import { describe, expect, test } from 'bun:test'
import { parse } from '../index'

describe('SQL 解析测试', () => {
  test('基础查询 token', () => {
    const code = `SELECT u.id, u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.active = TRUE AND o.total >= 99.5
GROUP BY u.id, u.name
ORDER BY order_count DESC
LIMIT 10;`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'keyword.control.sql')).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'support.function.builtin.sql')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.table.sql')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.column.sql')).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.language.boolean.sql')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'constant.numeric.sql')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.operator.sql')).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'punctuation.separator.comma.sql')
    ).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'punctuation.terminator.statement.sql')
    ).toBe(true)
  })

  test('支持注释、字符串和参数占位符', () => {
    const code = `-- fetch one user
SELECT "display_name"
FROM "users"
WHERE id = $1
  AND email = :email
  AND status = @status
  AND nickname = ?
  AND deleted_at IS NULL
  AND remark = 'hello sql'
/* tail */`
    const tokens = parse(code).flat()

    expect(
      tokens.some((t) => t.scope === 'comment.line.double-dash.sql')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'comment.block.sql')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.single.sql')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.double.sql')).toBe(true)
    expect(tokens.some((t) => t.scope === 'variable.parameter.sql')).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.language.null.sql')).toBe(
      true
    )
  })

  test('未闭合注释与字符串不应崩溃', () => {
    const code = `SELECT 'hello
/* not closed`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(
      tokens.some(
        (t) =>
          t.scope === 'string.quoted.single.sql' ||
          t.scope === 'comment.block.sql'
      )
    ).toBe(true)
  })

  test('行号追踪正确', () => {
    const code = `SELECT id
FROM users
WHERE id = 1;`
    const tokens = parse(code).flat()
    const whereToken = tokens.find(
      (t) => t.text.toLowerCase() === 'where' && t.scope === 'keyword.control.sql'
    )

    expect(whereToken?.line).toBe(3)
  })
})
