import { describe, expect, test } from 'bun:test'
import { parse } from '../index'

describe('C# 解析测试', () => {
  test('基础语法 token', () => {
    const code = `using System;
using System.Collections.Generic;
using System.Linq;

namespace Demo.App;

[Serializable]
public record User(int Id, string Name, bool Active);

public enum Status {
  Init = 0,
  Active = 1,
  Disabled = 2
}

public class UserService : BaseService {
  private readonly Dictionary<int, User> _cache = new();

  public UserService() : base() {}

  public async Task<List<User>> FindActiveAsync(IEnumerable<int> ids) {
#if DEBUG
    Console.WriteLine("debug mode");
#endif
    var file = @"C:\\temp\\logs\\app.txt";
    var payload = """
{
  "name": "coder",
  "ok": true
}
""";
    char grade = 'A';
    var enabled = true;
    var missing = null;

    foreach (var id in ids) {
      if (_cache.TryGetValue(id, out var cached) && cached.Active) {
        continue;
      }
      var user = await this.LoadAsync(id);
      if (user is null || !user.Active) {
        continue;
      }
      _cache[id] = user;
    }

    return _cache.Values
      .Where(u => u.Active)
      .OrderBy(u => u.Name)
      .ToList();
  }

  private async Task<User?> LoadAsync(int id) {
    await Task.Delay(1);
    return id > 0 ? new User(id, $"user-{id}", true) : null;
  }
}`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'keyword.declaration.csharp')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'keyword.control.csharp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.modifier.csharp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'support.type.builtin.csharp')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'entity.name.type.csharp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.function.csharp')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'entity.name.namespace.csharp')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'meta.attribute.csharp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'meta.preprocessor.csharp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'variable.language.csharp')).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'constant.language.boolean.csharp')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.language.null.csharp')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'constant.numeric.csharp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.double.csharp')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'string.quoted.single.csharp')).toBe(
      true
    )
    expect(
      tokens.some((t) => t.scope === 'string.quoted.verbatim.csharp')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.raw.csharp')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'operator.csharp')).toBe(true)
  })

  test('支持注释与块注释', () => {
    const code = `// line comment
/* block
   comment */
public int Run() {
  return 1;
}`
    const tokens = parse(code).flat()

    expect(
      tokens.some((t) => t.scope === 'comment.line.double-slash.csharp')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'comment.block.csharp')).toBe(true)
    expect(tokens.some((t) => t.text === 'Run')).toBe(true)
  })

  test('未闭合字符串/注释不应崩溃', () => {
    const code = `var name = "coder
/* not closed`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(
      tokens.some(
        (t) =>
          t.scope === 'string.quoted.double.csharp' ||
          t.scope === 'comment.block.csharp'
      )
    ).toBe(true)
  })

  test('行号追踪正确', () => {
    const code = `int Add(int a, int b) {
  var sum = a + b;
  return sum;
}`
    const tokens = parse(code).flat()
    const returnToken = tokens.find(
      (t) => t.text === 'return' && t.scope === 'keyword.control.csharp'
    )

    expect(returnToken?.line).toBe(3)
  })
})
