import { runLanguageBenchmark } from './common'

const generateTestCode = (lines: number): string => {
  const codeLines: string[] = []

  for (let i = 0; i < lines; i++) {
    const lineType = i % 10

    switch (lineType) {
      case 0:
        codeLines.push(`# comment line ${i}`)
        break
      case 1:
        codeLines.push(`value_${i}: int = ${i}`)
        break
      case 2:
        codeLines.push(`text_${i} = "line ${i}"`)
        break
      case 3:
        codeLines.push(`msg_${i} = f"value={value_${i}:.2f}"`)
        break
      case 4:
        codeLines.push(`def fn_${i}(x: int) -> int: return x + ${i}`)
        break
      case 5:
        codeLines.push(`class C${i}: pass`)
        break
      case 6:
        codeLines.push(`items_${i} = [x for x in range(10) if x > 2]`)
        break
      case 7:
        codeLines.push(`with open("f.txt") as f: data_${i} = f.read()`)
        break
      case 8:
        codeLines.push(`try: a_${i} = 1/${i + 1}\nexcept Exception as e: print(e)`)
        break
      case 9:
        codeLines.push(`@decorator\ndef run_${i}(): return None`)
        break
    }
  }

  return codeLines.join('\n')
}

runLanguageBenchmark({
  languageName: 'Python',
  lang: 'python',
  generateTestCode
})
