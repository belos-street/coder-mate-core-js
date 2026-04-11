import { describe, expect, test } from 'bun:test'
import { parse } from '../index'

describe('Java 解析测试', () => {
  test('基础语法 token', () => {
    const code = `package com.example.demo;
import java.util.List;
import java.util.Map;

@Service
public class UserService extends BaseService implements AutoCloseable {
  private static final int DEFAULT_LIMIT = 10;
  private final Repository repository;

  public UserService(Repository repository) {
    this.repository = repository;
  }

  @Override
  public List<User> findActiveUsers(int limit) {
    if (limit <= 0) {
      return List.of();
    }
    boolean active = true;
    String sql = "select * from users where active = true";
    char flag = 'Y';
    return repository.query(sql, limit);
  }
}`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'keyword.declaration.java')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.modifier.java')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.control.java')).toBe(true)
    expect(tokens.some((t) => t.scope === 'support.type.builtin.java')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.type.java')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.function.java')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.namespace.java')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'meta.annotation.java')).toBe(true)
    expect(tokens.some((t) => t.scope === 'variable.language.java')).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.language.boolean.java')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'constant.numeric.java')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.double.java')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'string.quoted.single.java')).toBe(
      true
    )
  })

  test('支持注释、text block、泛型、lambda 与 switch expression', () => {
    const code = `// line comment
/* block
   comment */
public record Event<T>(String id, T payload) {}

String template = """
{
  "name": "coder",
  "level": 3
}
""";

var result = events.stream()
  .filter(e -> e != null)
  .map(Event::id)
  .toList();

int code = switch (status) {
  case "READY" -> 1;
  default -> 0;
};`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'comment.line.double-slash.java')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'comment.block.java')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.triple.java')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'operator.java')).toBe(true)
    expect(tokens.some((t) => t.text === 'record')).toBe(true)
    expect(tokens.some((t) => t.text === 'switch')).toBe(true)
  })

  test('未闭合字符串/注释不应崩溃', () => {
    const code = `String a = "not closed
/* block not closed`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(
      tokens.some(
        (t) =>
          t.scope === 'string.quoted.double.java' ||
          t.scope === 'comment.block.java'
      )
    ).toBe(true)
  })

  test('行号追踪正确', () => {
    const code = `class Demo {
  int sum(int a, int b) {
    return a + b;
  }
}`
    const tokens = parse(code).flat()
    const returnToken = tokens.find(
      (t) => t.text === 'return' && t.scope === 'keyword.control.java'
    )

    expect(returnToken?.line).toBe(3)
  })
})
