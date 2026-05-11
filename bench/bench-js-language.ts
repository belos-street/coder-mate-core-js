import { runLanguageBenchmark } from './common'

const generateTestCode = (lines: number): string => {
  const codeLines: string[] = []

  for (let i = 0; i < lines; i++) {
    const lineType = i % 10

    switch (lineType) {
      case 0:
        codeLines.push(`// Comment line ${i}`)
        break
      case 1:
        codeLines.push(`const variable${i} = ${i};`)
        break
      case 2:
        codeLines.push(`const str${i} = "string ${i}";`)
        break
      case 3:
        codeLines.push(`const template${i} = \`template ${i}\`;`)
        break
      case 4:
        codeLines.push(`function func${i}() { return ${i}; }`)
        break
      case 5:
        codeLines.push(`class Class${i} { method${i}() { return ${i}; } }`)
        break
      case 6:
        codeLines.push(`const arrow${i} = (x) => x * ${i};`)
        break
      case 7:
        codeLines.push(`const obj${i} = { key: ${i}, value: "${i}" };`)
        break
      case 8:
        codeLines.push(`if (condition${i}) { doSomething(${i}); }`)
        break
      case 9:
        codeLines.push(`const result${i} = obj?.property ?? ${i};`)
        break
    }
  }

  return codeLines.join('\n')
}

runLanguageBenchmark({
  languageName: 'JavaScript',
  lang: 'javascript',
  generateTestCode
})
