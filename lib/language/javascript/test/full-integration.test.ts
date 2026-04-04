import { describe, it, expect } from 'bun:test'
import { generateJavaScriptTokens } from '../main'

describe('generateJavaScriptTokens - 完整代码集成测试', () => {
  it('should tokenize ES2020 class with modern syntax', () => {
    const code = `
class Person extends Object {
  constructor(name, age) {
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
`
    const tokens = generateJavaScriptTokens(code)

    const keywordTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-keyword')
    const keywordValues = keywordTokens.map((t) => t.value)

    const literalTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-literal')
    const literalValues = literalTokens.map((t) => t.value)

    expect(keywordValues).toContain('class')
    expect(keywordValues).toContain('extends')
    expect(keywordValues).toContain('constructor')
    expect(keywordValues).toContain('static')
    expect(keywordValues).toContain('get')
    expect(keywordValues).toContain('async')
    expect(keywordValues).toContain('await')
    expect(keywordValues).toContain('new')
    expect(keywordValues).toContain('return')
    expect(literalValues).toContain('this')
  })

  it('should tokenize destructuring and spread operators', () => {
    const code = `
const { name, age } = user;
const arr = [...list1, ...list2];
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
`
    const tokens = generateJavaScriptTokens(code)

    const operatorTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-operator')
    const operatorValues = operatorTokens.map((t) => t.value)

    expect(operatorValues).toContain('...')
    expect(operatorValues).toContain('=>')

    const punctuationTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-punctuation')
    const punctuationValues = punctuationTokens.map((t) => t.value)
    expect(punctuationValues).toContain(',')
  })

  it('should tokenize optional chaining', () => {
    const code = `
const value = obj?.prop?.method?.();
const result = data?.items?.[0]?.value;
`
    const tokens = generateJavaScriptTokens(code)

    const operatorTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-operator')
    const operatorValues = operatorTokens.map((t) => t.value)

    expect(operatorValues).toContain('?.')
    expect(operatorValues).toContain('?.')
  })

  it('should tokenize nullish coalescing', () => {
    const code = `
const value = input ?? defaultValue;
obj.prop ??= fallback;
`
    const tokens = generateJavaScriptTokens(code)

    const operatorTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-operator')
    const operatorValues = operatorTokens.map((t) => t.value)

    expect(operatorValues).toContain('??')
    expect(operatorValues).toContain('??=')
  })

  it('should tokenize BigInt and numeric separators', () => {
    const code = `
const bigNum = 9007199254740991n;
const formatted = 1_000_000_000;
const hex = 0xDEAD_BEEF;
const binary = 0b1010_0101;
`
    const tokens = generateJavaScriptTokens(code)

    const numberTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-number')
    const numberValues = numberTokens.map((t) => t.value)

    expect(numberValues).toContain('9007199254740991n')
    expect(numberValues).toContain('1_000_000_000')
    expect(numberValues).toContain('0xDEAD_BEEF')
    expect(numberValues).toContain('0b1010_0101')
  })

  it('should tokenize import/export statements', () => {
    const code = `
import React from 'react';
import { useState, useEffect } from 'react';
import * as utils from './utils';
export default App;
export { user, setUser };
export const VERSION = '1.0.0';
`
    const tokens = generateJavaScriptTokens(code)

    const keywordTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-keyword')
    const keywordValues = keywordTokens.map((t) => t.value)

    expect(keywordValues).toContain('import')
    expect(keywordValues).toContain('export')
    expect(keywordValues).toContain('from')
    expect(keywordValues).toContain('as')
    expect(keywordValues).toContain('default')
  })

  it('should tokenize comments correctly', () => {
    const code = `
// This is a single-line comment
const x = 10; // inline comment
/* Multi-line
   comment */
`
    const tokens = generateJavaScriptTokens(code)

    const commentTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-comment')
    expect(commentTokens.length).toBeGreaterThan(0)
    expect(commentTokens[0]?.value).toContain('//')
  })

  it('should tokenize strings correctly', () => {
    const code = `
const single = 'single quotes';
const double = "double quotes";
`
    const tokens = generateJavaScriptTokens(code)

    const stringTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-string')
    expect(stringTokens.length).toBe(2)
    expect(stringTokens[0]?.value).toContain("'")
    expect(stringTokens[1]?.value).toContain('"')
  })

  it('should tokenize loop statements', () => {
    const code = `
for (let i = 0; i < 10; i++) {
  console.log(i);
}

for (const item of items) {
  console.log(item);
}

while (true) {
  break;
}
`
    const tokens = generateJavaScriptTokens(code)

    const keywordTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-keyword')
    const keywordValues = keywordTokens.map((t) => t.value)

    expect(keywordValues).toContain('for')
    expect(keywordValues).toContain('while')
    expect(keywordValues).toContain('break')
    expect(keywordValues).toContain('of')
  })

  it('should tokenize try-catch-finally', () => {
    const code = `
try {
  riskyOperation();
} catch (error) {
  handleError(error);
} finally {
  cleanup();
}
`
    const tokens = generateJavaScriptTokens(code)

    const keywordTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-keyword')
    const keywordValues = keywordTokens.map((t) => t.value)

    expect(keywordValues).toContain('try')
    expect(keywordValues).toContain('catch')
    expect(keywordValues).toContain('finally')
  })

  it('should tokenize literals correctly', () => {
    const code = `
const boolTrue = true;
const boolFalse = false;
const nil = null;
let und = undefined;
`
    const tokens = generateJavaScriptTokens(code)

    const literalTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-literal')
    const literalValues = literalTokens.map((t) => t.value)

    expect(literalValues).toContain('true')
    expect(literalValues).toContain('false')
    expect(literalValues).toContain('null')
    expect(literalValues).toContain('undefined')
  })

  it('should track line and column correctly', () => {
    const code = `const a = 1;
const b = 2;
const c = 3;`

    const tokens = generateJavaScriptTokens(code)

    expect(tokens.length).toBe(3)

    const line1Tokens = tokens[0]!
    expect(line1Tokens.length).toBeGreaterThan(0)
    expect(line1Tokens[0]?.line).toBe(1)
    expect(line1Tokens[0]?.col[0]).toBe(0)
  })

  it('should handle async/await correctly', () => {
    const code = `
async function fetchData() {
  const response = await fetch('/api');
  const data = await response.json();
  return data;
}
`
    const tokens = generateJavaScriptTokens(code)

    const keywordTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-keyword')
    const keywordValues = keywordTokens.map((t) => t.value)

    expect(keywordValues).toContain('async')
    expect(keywordValues).toContain('await')
    expect(keywordValues).toContain('function')
    expect(keywordValues).toContain('return')
  })

  it('should handle complex expression with multiple operators', () => {
    const code = `
const result = a + b * c - d / e % f;
const compared = x === y && z !== w || p < q && r >= s;
`
    const tokens = generateJavaScriptTokens(code)

    const operatorTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-operator')
    const operatorValues = operatorTokens.map((t) => t.value)

    expect(operatorValues).toContain('+')
    expect(operatorValues).toContain('*')
    expect(operatorValues).toContain('-')
    expect(operatorValues).toContain('/')
    expect(operatorValues).toContain('%')
    expect(operatorValues).toContain('===')
    expect(operatorValues).toContain('!==')
    expect(operatorValues).toContain('&&')
    expect(operatorValues).toContain('||')
    expect(operatorValues).toContain('<')
    expect(operatorValues).toContain('>=')
  })

  it('should handle regex-like division correctly', () => {
    const code = `
const ratio = x / y;
const half = x / 2;
`
    const tokens = generateJavaScriptTokens(code)

    const operatorTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-operator')
    const slashTokens = operatorTokens.filter((t) => t.value === '/')

    expect(slashTokens.length).toBe(2)
  })

  it('should handle scientific notation', () => {
    const code = `
const large = 1e10;
const small = 1.5e-3;
const withPlus = 1e+5;
`
    const tokens = generateJavaScriptTokens(code)

    const numberTokens = tokens
      .flat()
      .filter((token) => token.type === 'token-number')
    const numberValues = numberTokens.map((t) => t.value)

    expect(numberValues).toContain('1e10')
    expect(numberValues).toContain('1.5e-3')
    expect(numberValues).toContain('1e+5')
  })
})
