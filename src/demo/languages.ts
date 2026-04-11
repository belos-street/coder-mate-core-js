import type { LanguageId } from './types'

export const LANGUAGE_LABELS: Record<LanguageId, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  html: 'HTML',
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
  html: `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="HTML syntax showcase for tokenizer demo" />
    <meta name='theme-color' content='#0f172a' />
    <link rel="icon" href="/favicon.ico" />
    <link rel="preload" as="image" href="/hero.webp" />
    <title>Coder Mate HTML Showcase</title>
    <style>
      :root { --brand: #2563eb; }
      body { margin: 0; font-family: system-ui; }
      .card { border: 1px solid #ddd; padding: 12px; }
    </style>
  </head>
  <body class="theme-light" data-mode='demo' data-version=1>
    <!-- 顶部导航 -->
    <header id="top" class="site-header">
      <h1>HTML&nbsp;Tokenizer&nbsp;Demo</h1>
      <p>Common tags, attrs, entities: &amp; &lt; &gt; &copy;</p>
      <nav aria-label="main nav">
        <a href="#content">Content</a>
        <a href="#form" target="_blank" rel="noopener noreferrer">Form</a>
        <a href="#table">Table</a>
      </nav>
    </header>

    <main id="content">
      <section class="card" aria-labelledby="text-title">
        <h2 id="text-title">Text Semantics</h2>
        <p>
          This is <strong>strong</strong>, <em>emphasis</em>, <mark>mark</mark>,
          <small>small</small>, <code>inline-code</code>, <kbd>Ctrl + K</kbd>.
        </p>
        <blockquote cite="https://example.com">
          Keep it simple, keep it robust.
        </blockquote>
        <pre><code>&lt;button type="button"&gt;Hello&lt;/button&gt;</code></pre>
        <hr />
      </section>

      <section class="card" aria-labelledby="list-title">
        <h2 id="list-title">Lists</h2>
        <ul>
          <li>unordered item A</li>
          <li>unordered item B</li>
        </ul>
        <ol start=3>
          <li>ordered item C</li>
          <li>ordered item D</li>
        </ol>
        <dl>
          <dt>HTML</dt>
          <dd>HyperText Markup Language</dd>
        </dl>
      </section>

      <section class="card" aria-labelledby="media-title">
        <h2 id="media-title">Media</h2>
        <img src="/cover.png" alt="cover" width=240 loading=lazy decoding=async />
        <picture>
          <source srcset="/hero.avif" type="image/avif" />
          <source srcset='/hero.webp' type='image/webp' />
          <img src="/hero.jpg" alt="hero image fallback" />
        </picture>
        <video controls preload="metadata" width="320">
          <source src="/intro.mp4" type="video/mp4" />
          <track kind="captions" src="/intro.vtt" srclang="en" label="English" />
        </video>
        <audio controls>
          <source src="/intro.mp3" type="audio/mpeg" />
        </audio>
        <iframe src="https://example.com" title="preview" loading=lazy></iframe>
      </section>

      <section id="form" class="card" aria-labelledby="form-title">
        <h2 id="form-title">Form</h2>
        <form action="/submit" method="post" autocomplete=on novalidate>
          <fieldset>
            <legend>User Profile</legend>

            <label for="email">Email</label>
            <input id="email" name="email" type="email" required placeholder="you@example.com" />

            <label for='password'>Password</label>
            <input id='password' name='password' type='password' minlength=8 />

            <label for="bio">Bio</label>
            <textarea id="bio" name="bio" rows=4 cols="36">Hello world</textarea>

            <label for="role">Role</label>
            <select id="role" name="role">
              <option value="">Please select</option>
              <option value="admin">Admin</option>
              <option value="editor" selected>Editor</option>
            </select>

            <label>
              <input type="checkbox" name="agree" checked />
              I agree to terms
            </label>

            <label>
              <input type="radio" name="plan" value="pro" />
              Pro
            </label>
            <label>
              <input type="radio" name="plan" value="team" />
              Team
            </label>

            <input type=text name=token value=abc123 readonly />
            <button type="submit">Submit</button>
            <button type="reset" disabled>Reset</button>
          </fieldset>
        </form>
      </section>

      <section id="table" class="card" aria-labelledby="table-title">
        <h2 id="table-title">Table</h2>
        <table>
          <caption>Quarterly Revenue</caption>
          <thead>
            <tr>
              <th scope="col">Quarter</th>
              <th scope="col">Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Q1</td>
              <td>$12,000</td>
            </tr>
            <tr>
              <td>Q2</td>
              <td>$18,500</td>
            </tr>
          </tbody>
        </table>
      </section>

      <details>
        <summary>More content</summary>
        <p>Hidden by default, expanded on click.</p>
      </details>
    </main>

    <footer class="site-footer">
      <p>Built with semantic HTML and tokenizer-friendly syntax.</p>
      <br />
    </footer>

    <!-- 多行注释示例
         tokenizer should keep this as comment.block.html -->
    <script type="module">
      const root = document.getElementById("top");
      if (root) root.dataset.ready = "true";
    </script>
  </body>
</html>`,
  json: `{
  "project": "coder-mate-core-js",
  "version": 1,
  "stable": true,
  "threshold": -12.5e+2,
  "items": [1, 2, 3],
  "meta": null
}`,
  python: `from typing import Optional, Iterable
from dataclasses import dataclass

DEFAULT_LIMIT = 5

@dataclass
class User:
    id: int
    name: str
    score: float = 0.0


def to_label(user: User, idx: int) -> str:
    note = """multi-line
python doc text"""
    return f"[{idx:02d}] {user.name!r} => {user.score:.2f} | {note!s}"


class UserService:
    def __init__(self, source: str = "users.txt") -> None:
        self.source = source

    @staticmethod
    def normalize_name(name: str) -> str:
        return name.strip().title()

    async def fetch_remote(self, key: str) -> Optional[str]:
        # 模拟异步流程
        await sleep(0)
        return key if key else None

    def load(self, limit: int = DEFAULT_LIMIT) -> list[str]:
        values = [x for x in range(limit) if x > 0]
        tags = {f"u-{x}" for x in values}
        index_map = {x: f"item-{x}" for x in values}

        try:
            with open(self.source) as f:
                first_line = f.readline()
        except OSError as err:
            print(err)
            first_line = "fallback"

        if first_line is None:
            return []

        users = [
            User(id=i, name=self.normalize_name(f"user_{i}"), score=float(i) / 3)
            for i in values
        ]

        result = [to_label(u, i) for i, u in enumerate(users) if u.score >= 0]

        match len(result):
            case 0:
                return ["empty"]
            case 1:
                return result
            case _:
                return [f"{line} | {index_map.get(i, 'N/A')}" for i, line in enumerate(result)]


def sum_positive(nums: Iterable[int]) -> int:
    total = 0
    for n in nums:
        if n is None:
            continue
        if n > 0:
            total += n
    return total


service = UserService()
lines = service.load()
print(lines)
print(sum_positive([1, 2, 3, -4]))`
}
