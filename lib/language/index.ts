export {
  getLanguage,
  listLanguages,
  registerBuiltinLanguages,
  registerLanguage,
  resetLanguageRegistryForTest,
  tokenize
} from './manager'
export { BUILTIN_LANGUAGES } from './builtins'
export { bashLanguage, parse as parseBash } from './bash'
export { cLanguage, parse as parseC } from './c'
export { cppLanguage, parse as parseCpp } from './cpp'
export { csharpLanguage, parse as parseCsharp } from './csharp'
export { cssLanguage, parse as parseCSS } from './css'
export { goLanguage, parse as parseGo } from './go'
export { htmlLanguage, parse as parseHTML } from './html'
export { javascriptLanguage, parse as parseJavaScript } from './javascript'
export { javaLanguage, parse as parseJava } from './java'
export { jsonLanguage, parse as parseJSON } from './json'
export { markdownLanguage, parse as parseMarkdown } from './markdown'
export { phpLanguage, parse as parsePHP } from './php'
export { pythonLanguage, parse as parsePython } from './python'
export { rustLanguage, parse as parseRust } from './rust'
export { sqlLanguage, parse as parseSQL } from './sql'
export { typescriptLanguage, parse as parseTypeScript } from './typescript'
export { yamlLanguage, parse as parseYAML } from './yaml'
