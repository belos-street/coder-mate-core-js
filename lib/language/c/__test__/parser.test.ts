import { describe, expect, test } from 'bun:test'
import { parse } from '../index'

describe('C 解析测试', () => {
  test('基础语法 token', () => {
    const code = `#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>

// compute totals
#define MAX_RETRY 3
#define SQUARE(x) ((x) * (x))

typedef struct User {
  int id;
  const char *name;
  bool active;
} User;

enum Status {
  STATUS_INIT = 0,
  STATUS_READY = 1,
  STATUS_FAILED = 2
};

static uint32_t total_count = 0;

int sum(int a, int b) {
  return a + b;
}

int main(void) {
  User user = { .id = 1, .name = "coder", .active = true };
  char flag = 'Y';

  if (user.active && flag == 'Y') {
    total_count += (uint32_t)SQUARE(user.id);
  } else {
    total_count = 0;
  }

  for (int i = 0; i < MAX_RETRY; i++) {
    printf("retry=%d\\n", i);
  }

  User *ptr = NULL;
  ptr = &user;
  return sum((int)total_count, ptr->id);
}`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'keyword.control.directive.c')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'string.quoted.angle.c')).toBe(true)
    expect(tokens.some((t) => t.scope === 'comment.line.double-slash.c')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'keyword.declaration.c')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.modifier.c')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.control.c')).toBe(true)
    expect(tokens.some((t) => t.scope === 'support.type.builtin.c')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.type.c')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.function.c')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.macro.c')).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.language.boolean.c')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'constant.language.null.c')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'constant.numeric.c')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.double.c')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.single.c')).toBe(true)
    expect(tokens.some((t) => t.scope === 'operator.c')).toBe(true)
  })

  test('支持块注释与条件编译', () => {
    const code = `/* parser should keep this as block comment */
#ifndef APP_MODE
#define APP_MODE 1
#endif

int run(void) {
  return APP_MODE;
}`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'comment.block.c')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.control.directive.c')).toBe(
      true
    )
    expect(
      tokens.some(
        (t) =>
          t.scope === 'keyword.control.directive.c' &&
          t.text.includes('#ifndef')
      )
    ).toBe(true)
    expect(tokens.some((t) => t.text === 'run')).toBe(true)
  })

  test('未闭合字符串与注释不应崩溃', () => {
    const code = `char *name = "coder
/* not closed`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(
      tokens.some(
        (t) =>
          t.scope === 'string.quoted.double.c' || t.scope === 'comment.block.c'
      )
    ).toBe(true)
  })

  test('行号追踪正确', () => {
    const code = `int add(int a, int b) {
  int sum = a + b;
  return sum;
}`
    const tokens = parse(code).flat()
    const returnToken = tokens.find(
      (t) => t.text === 'return' && t.scope === 'keyword.control.c'
    )

    expect(returnToken?.line).toBe(3)
  })
})
