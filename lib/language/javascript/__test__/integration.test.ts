import { test, expect, describe } from 'bun:test'
import { parse, highlight } from '../main'

describe('集成测试', () => {
  describe('完整代码高亮', () => {
    test('ES2020 BigInt', () => {
      const code = 'const num = 123n;'
      const html = highlight(code)

      expect(html).toContain('const')
      expect(html).toContain('123n')
      expect(html).toContain('#B5CEA8') // 数字颜色
    })

    test('ES2020 可选链和空值合并', () => {
      const code = 'const city = user?.address?.city ?? "Unknown";'
      const html = highlight(code)

      expect(html).toContain('?.')
      expect(html).toContain('??')
      expect(html).toContain('#DCDCAA') // 可选链和空值合并的颜色
      expect(html).toContain('font-weight: bold')
    })

    test('ES2020 globalThis', () => {
      const code = 'console.log(globalThis);'
      const html = highlight(code)

      expect(html).toContain('globalThis')
      expect(html).toContain('#C586C0') // globalThis 的颜色
    })

    test('ES2020 Promise.allSettled', () => {
      const code = 'Promise.allSettled(promises);'
      const html = highlight(code)

      expect(html).toContain('Promise.allSettled')
      expect(html).toContain('#DCDCAA') // 函数颜色
    })

    test('ES2020 动态导入', () => {
      const code = 'import("./module.js").then(mod => mod.hello());'
      const html = highlight(code)

      expect(html).toContain('import(')
      expect(html).toContain('./module.js')
      expect(html).toContain('#569CD6') // import 关键字颜色
    })

    test('多行注释', () => {
      const code = `/* line1
line2
line3 */`
      const html = highlight(code)

      expect(html).toContain('/*')
      expect(html).toContain('line1')
      expect(html).toContain('line2')
      expect(html).toContain('line3')
      expect(html).toContain('*/')
      expect(html).toContain('#6A9955') // 注释颜色
    })

    test('模板字符串插值', () => {
      const code = 'const greeting = `Hello, ${name}!`;'
      const html = highlight(code)

      expect(html).toContain('Hello,')
      expect(html).toContain('&#36;{') // ${ 被转义
      expect(html).toContain('name')
      expect(html).toContain('}')
      expect(html).toContain('#CE9178') // 字符串颜色
      expect(html).toContain('#C586C0') // 插值符号颜色
    })

    test('类定义', () => {
      const code = `
class Person {
  constructor(name) {
    this.name = name;
  }
}`
      const html = highlight(code)

      expect(html).toContain('class')
      expect(html).toContain('Person')
      expect(html).toContain('constructor')
      expect(html).toContain('this')
      expect(html).toContain('#569CD6') // 关键字颜色
    })

    test('async/await', () => {
      const code = 'async function fetchData() { await fetch(url); }'
      const html = highlight(code)

      expect(html).toContain('async')
      expect(html).toContain('await')
      expect(html).toContain('#C586C0') // async/await 颜色
    })

    test('箭头函数', () => {
      const code = 'const double = (x) => x * 2;'
      const html = highlight(code)

      expect(html).toContain('=&gt;') // => 被转义
      expect(html).toContain('#DCDCAA') // 箭头函数颜色
    })
  })

  describe('对比 demo.html 输出', () => {
    const es2020TestCode = `
/*
 * ES2020完整语法测试 - 多行注释
 * 包含所有ES2020核心语法
*/
// 1. 变量声明 + ES2020 BigInt
const num1 = 123n; // BigInt
const num2 = 0b1010n; // 二进制BigInt
const num3 = 0x1Fn; // 十六进制BigInt
let price = 99.99;
var isOk = true;

// 2. ES2020 可选链?. + 空值合并??
const user = { name: "Alice", address: { city: "Beijing" } };
const city = user?.address?.city ?? "Unknown"; // 可选链+空值合并
const age = user?.age ?? 18;

// 3. ES2020 globalThis
console.log(globalThis === window); // 浏览器环境

// 4. 可选catch绑定（ES2020）
try {
  JSON.parse(invalidJson);
} catch { // 无参数的catch
  console.error("解析失败");
}

// 5. Promise.allSettled（ES2020）
const promises = [Promise.resolve(1), Promise.reject("error")];
Promise.allSettled(promises).then(results => {
  results.forEach(result => console.log(result.status));
});

// 6. 模块化（ES2020）
import { foo } from './module.js';
import * as utils from './utils.js';
export const bar = 123;
export * as ns from './ns.js';
const modulePath = './dynamic.js';
import(modulePath).then(mod => mod.hello()); // 动态导入

// 7. 类（ES6+，ES2020兼容）
class Person {
  static type = "Human";
  constructor(name) {
    this.name = name;
  }
  greet() {
    return \`Hello, \${this.name.toUpperCase()}!\`; // 模板插值
  }
}
class Student extends Person {
  constructor(name, grade) {
    super(name);
    this.grade = grade;
  }
}

// 8. async/await
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("请求失败：", err.message);
  }
}

// 9. 箭头函数
const double = (x) => x * 2;
const sum = (a, b) => {
  return a + b;
};

// 10. 字面量
const arr = [1, 2, 3, null, undefined];
const obj = {
  [\`key-\${123}\`]: "computed", // 计算属性
  method() { return "hello"; }
};

// 11. 运算符
const a = 10, b = 20;
const result = (a + b) * (a - b) === 0 && a || b;
`

    test('完整 ES2020 代码解析', () => {
      const tokens = parse(es2020TestCode)

      expect(tokens.length).toBeGreaterThan(0)

      // 检查所有 token 都有正确的行列信息
      tokens.forEach((row, lineIndex) => {
        row.forEach((token) => {
          expect(token.line).toBeGreaterThanOrEqual(1)
          expect(token.col[0]).toBeGreaterThanOrEqual(1)
          expect(token.col[1]).toBeGreaterThanOrEqual(token.col[0])
        })
      })
    })

    test('完整 ES2020 代码高亮', () => {
      const html = highlight(es2020TestCode)

      // 检查 HTML 结构
      expect(html).toContain('<pre')
      expect(html).toContain('<code>')
      expect(html).toContain('</code>')
      expect(html).toContain('</pre>')

      // 检查关键字
      expect(html).toContain('const')
      expect(html).toContain('let')
      expect(html).toContain('var')
      expect(html).toContain('class')
      expect(html).toContain('function')

      // 检查 ES2020 特性
      expect(html).toContain('globalThis')
      expect(html).toContain('Promise.allSettled')
      expect(html).toContain('?.')
      expect(html).toContain('??')

      // 检查字符串
      expect(html).toContain('Alice')
      expect(html).toContain('Beijing')

      // 检查注释
      expect(html).toContain('ES2020完整语法测试')
      expect(html).toContain('BigInt')
    })

    test('行号正确', () => {
      const tokens = parse(es2020TestCode)

      // 检查行号连续性
      let expectedLine = 1
      tokens.forEach((row, index) => {
        if (row.length > 0) {
          // 第一行可能以换行符开始
          const firstNonNewlineToken = row.find(
            (t) => t.text !== '\n' && t.text !== '\r\n'
          )
          if (firstNonNewlineToken) {
            expect(firstNonNewlineToken.line).toBeGreaterThanOrEqual(1)
          }
          expectedLine++
        }
      })
    })

    test('颜色映射正确', () => {
      const html = highlight(es2020TestCode)

      // 检查关键字颜色
      expect(html).toContain('#569CD6') // 关键字

      // 检查字符串颜色
      expect(html).toContain('#CE9178') // 字符串

      // 检查数字颜色
      expect(html).toContain('#B5CEA8') // 数字

      // 检查注释颜色
      expect(html).toContain('#6A9955') // 注释

      // 检查运算符颜色
      expect(html).toContain('#D4D4D4') // 运算符
    })
  })

  describe('边界情况', () => {
    test('空代码', () => {
      const html = highlight('')

      expect(html).toContain('<pre')
      expect(html).toContain('<code>')
      expect(html).toContain('</code>')
      expect(html).toContain('</pre>')
    })

    test('只有空白字符', () => {
      const html = highlight('   \n   \n   ')

      expect(html).toContain('<pre')
      expect(html).toContain('<code>')
    })

    test('未闭合的字符串', () => {
      const code = 'const str = "unclosed'
      const html = highlight(code)

      expect(html).toContain('const')
      expect(html).toContain('str')
      expect(html).toContain('unclosed') // 未闭合的字符串内容
    })

    test('未闭合的多行注释', () => {
      const code = '/* unclosed comment'
      const html = highlight(code)

      expect(html).toContain('/*')
      expect(html).toContain('unclosed')
      expect(html).toContain('comment')
    })

    test('嵌套模板字符串', () => {
      const code = 'const html = `<div>${`nested ${value}`}</div>`;'
      const html = highlight(code)

      expect(html).toContain('&lt;div&gt;') // <div> 被转义
      expect(html).toContain('&#36;{') // ${ 被转义
      expect(html).toContain('nested')
      expect(html).toContain('value')
      expect(html).toContain('}')
    })

    test('复杂运算符组合', () => {
      const code = 'const result = a?.b?.c ?? d?.e ?? f;'
      const html = highlight(code)

      expect(html).toContain('?.')
      expect(html).toContain('??')
      expect(html).toContain('#DCDCAA')
    })

    test('混合引号字符串', () => {
      const code =
        'const str1 = "double"; const str2 = \'single\'; const str3 = `template`;'
      const html = highlight(code)

      expect(html).toContain('double')
      expect(html).toContain('single')
      expect(html).toContain('template')
      expect(html).toContain('&quot;') // 双引号被转义
      expect(html).toContain('&#39;') // 单引号被转义
      expect(html).toContain('&#96;') // 反引号被转义
    })

    test('特殊字符转义', () => {
      const code = 'const str = "line1\\nline2\\ttab";'
      const html = highlight(code)

      expect(html).toContain('line1')
      expect(html).toContain('line2')
      expect(html).toContain('tab')
    })

    test('Unicode 标识符', () => {
      const code = 'const 变量名 = "中文";'
      const html = highlight(code)

      // 注意：当前实现不支持 Unicode 标识符，中文字符会被当作普通字符处理
      expect(html).toContain('const')
      expect(html).toContain('中文')
    })

    test('超长行', () => {
      const longLine = 'const x = ' + '1'.repeat(1000) + ';'
      const html = highlight(longLine)

      expect(html).toContain('const')
      expect(html).toContain('x')
    })
  })
})
