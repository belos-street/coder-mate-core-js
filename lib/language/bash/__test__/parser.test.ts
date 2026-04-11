import { describe, expect, test } from 'bun:test'
import { parse } from '../index'

describe('Bash 解析测试', () => {
  test('基础脚本 token', () => {
    const code = `#!/usr/bin/env bash
set -euo pipefail
name="coder"
count=3
echo "hi $name" | sed 's/hi/hello/'
if [ "$count" -gt 0 ]; then
  export PATH="$PATH:/tmp/bin"
fi`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'comment.line.number-sign.bash')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'keyword.control.bash')).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'support.function.builtin.bash')
    ).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'variable.other.readwrite.bash')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'variable.parameter.bash')).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.numeric.bash')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.double.bash')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'string.quoted.single.bash')).toBe(true)
    expect(tokens.some((t) => t.scope === 'operator.bash')).toBe(true)
  })

  test('支持函数声明和特殊变量', () => {
    const code = `function greet() {
  local user="\${1:-guest}"
  printf '%s\\n' "$user"
  echo $?
}`
    const tokens = parse(code).flat()

    expect(
      tokens.some((t) => t.scope === 'keyword.declaration.function.bash')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.function.bash')).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'variable.language.special.bash')
    ).toBe(true)
  })

  test('未闭合字符串不应崩溃', () => {
    const code = `echo "hello
echo 'world`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(
      tokens.some(
        (t) =>
          t.scope === 'string.quoted.double.bash' ||
          t.scope === 'string.quoted.single.bash'
      )
    ).toBe(true)
  })

  test('行号追踪正确', () => {
    const code = `echo ok
count=1
if [ "$count" -gt 0 ]; then
  echo done
fi`
    const tokens = parse(code).flat()
    const ifToken = tokens.find(
      (t) => t.text === 'if' && t.scope === 'keyword.control.bash'
    )

    expect(ifToken?.line).toBe(3)
  })
})
