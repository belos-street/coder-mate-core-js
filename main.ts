import { generateJavaScriptTokens } from 'lib'
import { renderToApp } from './src/render'

const code = `class Person extends Object {
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
}`

const tokens = generateJavaScriptTokens(code)
renderToApp(tokens)

const style = document.createElement('style')
style.textContent = `
  body { font-family: monospace; padding: 20px; }
  .code-block {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;
  }
  .token-keyword { color: #569cd6; }
  .token-literal { color: #569cd6; }
  .token-string { color: #ce9178; }
  .token-number { color: #b5cea8; }
  .token-identifier { color: #9cdcfe; }
  .token-operator { color: #d4d4d4; }
  .token-punctuation { color: #d4d4d4; }
  .token-comment { color: #6a9955; }
  .token-whitespace { color: transparent; }
`
document.head.appendChild(style)
