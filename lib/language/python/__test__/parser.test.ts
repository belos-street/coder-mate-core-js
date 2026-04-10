import { describe, expect, test } from 'bun:test'
import { parse } from '../index'

describe('Python 解析测试', () => {
  test('基础语法 token', () => {
    const code = `class Greeter:
    def hello(self, name):
        if name is None:
            return "anonymous"
        # greet user
        return 'Hello'`

    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(tokens.some((t) => t.scope === 'keyword.declaration.python')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'keyword.control.python')).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.language.none.python')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'string.quoted.double.python')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'string.quoted.single.python')).toBe(
      true
    )
    expect(
      tokens.some((t) => t.scope === 'comment.line.number-sign.python')
    ).toBe(true)
  })

  test('数字与行列追踪', () => {
    const code = `x = 42
y = -3.14e+2`

    const rows = parse(code)
    const tokens = rows.flat()

    expect(tokens.some((t) => t.text === '42')).toBe(true)
    expect(tokens.some((t) => t.text === '-3.14e+2')).toBe(true)

    const xToken = tokens.find((t) => t.text === 'x')
    const yToken = tokens.find((t) => t.text === 'y')
    expect(xToken?.line).toBe(1)
    expect(yToken?.line).toBe(2)
  })

  test('函数名/类名/内建函数 scope', () => {
    const code = `class UserService:
    def build(self):
        print(len("ok"))`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'entity.name.class.python')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.function.python')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'support.function.builtin.python')).toBe(
      true
    )
  })

  test('三引号字符串（单/双）', () => {
    const code = `text = """line1
line2"""
doc = '''hello
world'''`
    const tokens = parse(code).flat()

    expect(
      tokens.some((t) => t.scope === 'string.quoted.double.triple.python')
    ).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'string.quoted.single.triple.python')
    ).toBe(true)
  })

  test('f-string 插值 scope', () => {
    const code = `name = "Tom"
msg = f"hello {name.upper()}"`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'string.interpolated.python')).toBe(
      true
    )
    expect(
      tokens.some(
        (t) => t.scope === 'punctuation.definition.interpolation.begin.python'
      )
    ).toBe(true)
    expect(
      tokens.some(
        (t) => t.scope === 'punctuation.definition.interpolation.end.python'
      )
    ).toBe(true)
  })

  test('未闭合三引号字符串容错', () => {
    const code = `doc = """line1
line2`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(
      tokens.some((t) => t.scope === 'string.quoted.double.triple.python')
    ).toBe(true)
  })

  test('长行与异常输入不应崩溃', () => {
    const longValue = 'x'.repeat(5000)
    const code = `value = "${longValue}"
bad = f"value={"`

    const tokens = parse(code).flat()
    expect(tokens.length).toBeGreaterThan(0)
  })

  test('装饰器 scope', () => {
    const code = `@app.get("/users")
def list_users():
    return []`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'meta.decorator.python')).toBe(true)
  })

  test('类型注解 scope', () => {
    const code = `def greet(name: str) -> Optional[str]:
    result: dict = {"ok": 1}
    return name`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'support.type.annotation.python')).toBe(
      true
    )
  })

  test('comprehension 变量 scope', () => {
    const code = `values = [x * 2 for x in items if x > 0]`
    const tokens = parse(code).flat()

    expect(
      tokens.some((t) => t.scope === 'variable.comprehension.python')
    ).toBe(true)
  })

  test('with/except as 别名 scope', () => {
    const code = `with open("a.txt") as f:
    pass
try:
    1 / 0
except Exception as e:
    print(e)`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'variable.alias.python')).toBe(true)
  })

  test('f-string 常见格式 scope', () => {
    const code = `price = 10.456
text = f"price={price:.2f} repr={price!r}"`
    const tokens = parse(code).flat()

    expect(
      tokens.some((t) => t.scope === 'punctuation.format.fstring.python')
    ).toBe(true)
  })

  test('复杂嵌套 f-string 不应崩溃', () => {
    const code = `name = "Tom"
value = 12.3456
text = f"outer={name} inner={f'{value:.3f}'} map={ {'a': value} }"`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(tokens.some((t) => t.scope === 'string.interpolated.python')).toBe(
      true
    )
    expect(
      tokens.some(
        (t) => t.scope === 'punctuation.definition.interpolation.begin.python'
      )
    ).toBe(true)
  })

  test('类型注解与常量 None 的 scope 不冲突', () => {
    const code = `def build(x: Optional[str]) -> CustomType:
    item: dict = {}
    if x is None:
        return None
    return CustomType()`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'support.type.annotation.python')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'constant.language.none.python')).toBe(
      true
    )
  })

  test('多装饰器与参数装饰器', () => {
    const code = `@router.get("/users")
@retry(times=3)
def fetch_users():
    return []`
    const tokens = parse(code).flat()

    const decoratorCount = tokens.filter(
      (t) => t.scope === 'meta.decorator.python'
    ).length
    expect(decoratorCount).toBeGreaterThanOrEqual(2)
  })

  test('match/case 与 async/await 关键字', () => {
    const code = `async def run(value):
    await fetch(value)
    match value:
        case 1:
            return True
        case _:
            return False`
    const tokens = parse(code).flat()

    const controlCount = tokens.filter(
      (t) => t.scope === 'keyword.control.python'
    ).length
    expect(controlCount).toBeGreaterThan(0)
  })

  test('未闭合三引号（单引号）容错', () => {
    const code = `doc = '''line1
line2`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(
      tokens.some((t) => t.scope === 'string.quoted.single.triple.python')
    ).toBe(true)
  })
})
