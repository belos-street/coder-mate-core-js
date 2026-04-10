import type { LanguageId } from './types'

export const LANGUAGE_LABELS: Record<LanguageId, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  json: 'JSON',
  python: 'Python'
}

export const LANGUAGE_SNIPPETS: Record<LanguageId, string> = {
  javascript: `/*
 * ES2020 完整语法测试
 * 演示所有核心语法特性
 */

// 1. 变量声明 + ES2020 BigInt
const num1 = 123n; // BigInt
const num2 = 0b1010n; // 二进制 BigInt
let str1 = "Hello, World!";
var x = 10;

// 2. ES2020 可选链和空值合并
const city = user?.address?.city ?? "Unknown";
const result = obj?.method?.() ?? "default";

// 3. ES2020 globalThis
console.log(globalThis);

// 4. ES2020 Promise.allSettled
Promise.allSettled([promise1, promise2])
  .then(results => console.log(results));

// 5. ES2020 动态导入
import("./module.js")
  .then(module => {
    module.hello();
  })
  .catch(err => {
    console.error(err);
  });

// 6. 类定义
class Person extends Object {
  constructor(name, age) {
    super();
    this.name = name;
    this.age = age;
  }

  static create(name, age) {
    return new Person(name, age);
  }

  get info() {
    return \`\${this.name} is \${this.age} years old\`;
  }

  async greet() {
    await fetch('/api');
    return 'Hello';
  }
}

// 7. 箭头函数
const add = (a, b) => a + b;
const multiply = (x) => x * 2;

// 8. 模板字符串
const template = \`Hello, \${name}!
Welcome to ES2020.\`;

// 9. 多行注释
/*
 * 这是一个多行注释
 * 可以跨越多行
 */

// 10. 对象字面量
const obj = {
  key: "value",
  method() {
    return "hello";
  }
};

// 11. 运算符
const a = 10, b = 20;
const result2 = (a + b) * (a - b) === 0 && a || b;`,
  typescript: `import type { ApiUser, ApiResponse } from "./types"
export type UserId = string | number

interface User {
  readonly id: UserId
  name: string
  role?: "admin" | "guest"
}

type ValueOf<T> = T[keyof T]
type UnboxPromise<T> = T extends Promise<infer R> ? R : T
type EventName<T extends string> = \`on\${Capitalize<T>}\`

type ReadonlyPick<T, K extends keyof T> = {
  readonly [P in K]?: T[P]
}

type Pair = [head: string, ...tail: number[]]

enum Status {
  Active = "active",
  Disabled = "disabled"
}

abstract class BaseService<T extends object> {
  protected cache = new Map<string, T>()
}

class UserService<T extends User> extends BaseService<T> implements User {
  public id: UserId = 1
  public name: string = "coder"
  public role: "admin" | "guest" = "admin"
  private status: Status = Status.Active

  constructor(name: string) {
    super()
    this.name = name
  }

  get profile(): ReadonlyPick<T, "id" | "name"> {
    return { id: this.id as T["id"], name: this.name as T["name"] }
  }

  async load<R extends ApiResponse<ApiUser>>(resp: R): Promise<UnboxPromise<Promise<R>>> {
    return Promise.resolve(resp)
  }
}

function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null
}

const defaultConfig = {
  retry: 3,
  mode: "strict"
} as const

const settings = {
  cache: true,
  strategy: "lru"
} satisfies Record<string, unknown>

const service = new UserService<User>("Alice")
const role = service.profile.name!.toUpperCase()
const city: string = profile?.address?.city ?? "Unknown"`,
  json: `{
  "project": "coder-mate-core-js",
  "version": 1,
  "stable": true,
  "threshold": -12.5e+2,
  "items": [1, 2, 3],
  "meta": null
}`,
  python: `from typing import Optional

@cache_result
def format_user(name: str, score: float) -> str:
    note = """multi-line
python string"""
    return f"{name!r}:{score:.2f} / {note!s}"

class UserService:
    def load(self, limit: int) -> list[str]:
        values = [x for x in range(limit) if x > 0]

        try:
            with open("users.txt") as f:
                first_line = f.read()
        except OSError as err:
            print(err)
            first_line = "fallback"

        if first_line is None:
            return []

        return [format_user(str(v), float(v)) for v in values]`
}
