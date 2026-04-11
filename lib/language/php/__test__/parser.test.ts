import { describe, expect, test } from 'bun:test'
import { parse } from '../index'

describe('PHP 解析测试', () => {
  test('基础语法 token', () => {
    const code = `<?php
namespace Demo\\App;

use DateTimeImmutable;
use Demo\\Contracts\\LoggerInterface;

#[Service('user-sync')]
final class UserService
{
  private const APP_NAME = 'coder-mate';
  private array $cache = [];

  public function __construct(
    private readonly LoggerInterface $logger
  ) {}

  public function sync(array $ids): array
  {
    $result = [];
    $enabled = true;
    $missing = null;
    $stamp = __DIR__;
    $json = "{\\"ok\\": true}";
    $cwd = \`pwd\`;

    foreach ($ids as $id) {
      if ($id <= 0 || !$enabled) {
        continue;
      }
      $user = $this->loadUser($id);
      if ($user === null) {
        continue;
      }
      $result[] = $user;
    }

    $status = match (true) {
      count($result) > 0 => 'ok',
      default => 'empty'
    };

    return $result;
  }

  private function loadUser(int $id): ?array
  {
    return $id > 1 ? ['id' => $id, 'name' => "user-" . $id] : null;
  }
}
?>`

    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'meta.tag.php')).toBe(true)
    expect(tokens.some((t) => t.scope === 'meta.attribute.php')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.declaration.php')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.modifier.php')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.control.php')).toBe(true)
    expect(tokens.some((t) => t.scope === 'support.type.builtin.php')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.type.php')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.function.php')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.namespace.php')).toBe(true)
    expect(tokens.some((t) => t.scope === 'variable.language.php')).toBe(true)
    expect(tokens.some((t) => t.scope === 'variable.other.php')).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'constant.language.boolean.php')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.language.null.php')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'constant.language.php')).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.numeric.php')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.double.php')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.single.php')).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'string.quoted.backtick.php')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'operator.php')).toBe(true)
  })

  test('支持行注释与块注释', () => {
    const code = `<?php
// slash comment
# hash comment
/* block
   comment */
function run() {
  return 1;
}`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'comment.line.double-slash.php')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'comment.line.number-sign.php')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'comment.block.php')).toBe(true)
    expect(tokens.some((t) => t.text === 'run')).toBe(true)
  })

  test('未闭合字符串/注释不应崩溃', () => {
    const code = `<?php
$name = "coder
/* not closed`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(
      tokens.some(
        (t) =>
          t.scope === 'string.quoted.double.php' ||
          t.scope === 'comment.block.php'
      )
    ).toBe(true)
  })

  test('行号追踪正确', () => {
    const code = `<?php
function add(int $a, int $b): int {
  return $a + $b;
}`
    const tokens = parse(code).flat()
    const returnToken = tokens.find(
      (t) => t.text === 'return' && t.scope === 'keyword.control.php'
    )

    expect(returnToken?.line).toBe(3)
  })
})
