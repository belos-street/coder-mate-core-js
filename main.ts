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
