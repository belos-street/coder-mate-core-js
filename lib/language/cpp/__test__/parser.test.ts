import { describe, expect, test } from 'bun:test'
import { parse } from '../index'

describe('C++ 解析测试', () => {
  test('基础语法 token', () => {
    const code = `#include <iostream>
#include <memory>
#include <optional>
#include <string>
#include <vector>

#define APP_NAME "coder-mate"
#define LOG_INFO(msg) std::cout << "[INFO] " << msg << std::endl

namespace demo {

template <typename T>
class Repository final {
public:
  explicit Repository(std::vector<T> items) : items_(std::move(items)) {}

  std::optional<T> findById(int id) const {
    for (const auto &item : items_) {
      if (item.id == id) {
        return item;
      }
    }
    return std::nullopt;
  }

private:
  std::vector<T> items_;
};

struct User {
  int id;
  std::string name;
  bool active;
};

} // namespace demo

int main() {
  demo::Repository<demo::User> repo({
    {1, "Alice", true},
    {2, "Bob", false},
    {3, "Carol", true}
  });

  auto result = repo.findById(1);
  const char level = 'A';
  const char *json = R"({"service":"cpp","ok":true})";

  if (result.has_value() && result->active && level == 'A') {
    LOG_INFO(APP_NAME);
  } else {
    std::cout << "not found" << std::endl;
  }

  std::unique_ptr<int> ptr = std::make_unique<int>(42);
  if (ptr != nullptr) {
    std::cout << *ptr << std::endl;
  }

  return 0;
}`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'keyword.control.directive.cpp')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'string.quoted.angle.cpp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.macro.cpp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.declaration.cpp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.modifier.cpp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.control.cpp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'support.type.builtin.cpp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.namespace.cpp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.type.cpp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.function.cpp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.language.boolean.cpp')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'constant.language.null.cpp')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'constant.numeric.cpp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.double.cpp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.single.cpp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.raw.cpp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'operator.cpp')).toBe(true)
  })

  test('支持块注释与条件编译', () => {
    const code = `/* parser should keep this as block comment */
#ifndef APP_MODE
#define APP_MODE "dev"
#endif

int run() {
  return 1;
}`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'comment.block.cpp')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.control.directive.cpp')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'entity.name.macro.cpp')).toBe(true)
  })

  test('未闭合字符串/注释不应崩溃', () => {
    const code = `std::string name = "coder
/* not closed`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(
      tokens.some(
        (t) =>
          t.scope === 'string.quoted.double.cpp' ||
          t.scope === 'comment.block.cpp'
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
      (t) => t.text === 'return' && t.scope === 'keyword.control.cpp'
    )

    expect(returnToken?.line).toBe(3)
  })
})
