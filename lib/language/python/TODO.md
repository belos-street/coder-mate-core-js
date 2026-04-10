# Python Language TODO

## Phase 1 (MVP)

- [x] 建立语言包基础结构
  - `type.ts`
  - `rule.ts`
  - `spec.ts`
  - `engine.ts`
  - `index.ts`
- [x] 支持基础 token 范围
  - 注释（`# ...`）
  - 关键字（`if/else/for/while/try/except/...`）
  - 声明关键字（`def/class`）
  - 常量（`True/False/None`）
  - 数字（整数/浮点/科学计数法）
  - 字符串（单引号/双引号，含转义，未闭合容错）
  - 标识符与常见运算符/标点
- [x] 注册为内置语言
  - `lib/language/builtins.ts`
  - `lib/language/index.ts`
- [x] 主题映射补齐 Python 常用 scope
  - `lib/themes/dark-plus.ts`
  - `lib/themes/github-light.ts`
- [x] 测试
  - `lib/language/python/__test__/parser.test.ts`
  - 更新 `lib/language/__test__/registry.test.ts`
- [x] Demo
  - 更新 `src/demo/languages.ts` 的 Python 示例代码

## Phase 2 (增强)

- [x] 三引号字符串（`'''` / `"""`）
- [x] 更精细语义 scope（函数名、类名、内建函数等）
- [x] f-string 更精细处理（插值 scope）
- [x] 边界场景测试补充（嵌套字符串、长行、异常输入）

## Phase 3 (实用增强)

- [x] 装饰器 `@...` scope
- [x] 类型注解高亮（`: Type` / `-> Type`）
- [x] f-string 常见格式（`!r` / `:.2f`）标记
- [x] comprehension 变量 scope
- [x] `with/except as` 别名变量 scope
