import { describe, expect, test } from 'bun:test'
import { parse } from '../index'

describe('Go 解析测试', () => {
  test('基础语法 token', () => {
    const code = `package main

import (
  "context"
  "fmt"
  m "math"
  "strings"
  "time"
)

const AppName = "coder-mate-go"
const DefaultRetry = 3

type Status int

const (
  StatusInit Status = iota
  StatusActive
  StatusDisabled
)

type User struct {
  ID     int
  Name   string
  Active bool
}

type Repository interface {
  FindByID(ctx context.Context, id int) (*User, error)
}

type InMemoryRepo struct {
  data map[int]User
}

func NewInMemoryRepo(users []User) *InMemoryRepo {
  store := make(map[int]User, len(users))
  for _, user := range users {
    store[user.ID] = user
  }
  return &InMemoryRepo{data: store}
}

func (r *InMemoryRepo) FindByID(ctx context.Context, id int) (*User, error) {
  _ = ctx
  user, ok := r.data[id]
  if !ok {
    return nil, fmt.Errorf("user not found: %d", id)
  }
  return &user, nil
}

func handle(ctx context.Context, repo Repository, ids []int) error {
  ch := make(chan User, len(ids))
  defer close(ch)

  go func() {
    for _, id := range ids {
      user, err := repo.FindByID(ctx, id)
      if err != nil || user == nil {
        continue
      }
      ch <- *user
    }
  }()

  timeout := time.After(50 * time.Millisecond)
  for {
    select {
    case <-ctx.Done():
      return ctx.Err()
    case <-timeout:
      return nil
    case user := <-ch:
      if strings.TrimSpace(user.Name) == "" {
        continue
      }
      enabled := true
      score := m.Abs(float64(user.ID))
      runeTag := 'A'
      raw := \`{"id":1,"ok":true}\`
      fmt.Printf(
        "%s enabled=%t score=%.1f tag=%c raw=%s\\n",
        AppName,
        enabled,
        score,
        runeTag,
        raw
      )
    default:
      break
    }
  }
}
`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'keyword.declaration.go')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.control.go')).toBe(true)
    expect(tokens.some((t) => t.scope === 'support.type.builtin.go')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.function.go')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.type.go')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.namespace.go')).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.language.boolean.go')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'constant.language.null.go')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'constant.language.iota.go')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'constant.numeric.go')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.double.go')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.single.go')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.raw.go')).toBe(true)
    expect(tokens.some((t) => t.scope === 'operator.go')).toBe(true)
  })

  test('支持注释与块注释', () => {
    const code = `// line comment
/* block
   comment */
func run() int {
  return 1
}`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'comment.line.double-slash.go')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'comment.block.go')).toBe(true)
    expect(tokens.some((t) => t.text === 'run')).toBe(true)
  })

  test('未闭合字符串/注释不应崩溃', () => {
    const code = `name := "coder
/* not closed`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(
      tokens.some(
        (t) =>
          t.scope === 'string.quoted.double.go' || t.scope === 'comment.block.go'
      )
    ).toBe(true)
  })

  test('行号追踪正确', () => {
    const code = `func add(a int, b int) int {
  sum := a + b
  return sum
}`
    const tokens = parse(code).flat()
    const returnToken = tokens.find(
      (t) => t.text === 'return' && t.scope === 'keyword.control.go'
    )

    expect(returnToken?.line).toBe(3)
  })
})
