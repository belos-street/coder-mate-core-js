import { runLanguageBenchmark } from './common'

const generateTestCode = (lines: number): string => {
  const codeLines: string[] = []

  for (let i = 0; i < lines; i++) {
    const lineType = i % 12

    switch (lineType) {
      case 0:
        codeLines.push(`import type { ApiUser${i} } from "./types"`)
        break
      case 1:
        codeLines.push(`export type UserId${i} = string | number`)
        break
      case 2:
        codeLines.push(`type Value${i}<T extends object> = T[keyof T]`)
        break
      case 3:
        codeLines.push(
          `type Box${i}<T> = T extends Promise<infer R> ? R : T`
        )
        break
      case 4:
        codeLines.push(
          `interface User${i} { readonly id: UserId${i}; name: string }`
        )
        break
      case 5:
        codeLines.push(
          `class Service${i}<T extends User${i}> extends Base${i}<T> implements User${i} { public id: UserId${i} = ${i}; public name: string = "n${i}" }`
        )
        break
      case 6:
        codeLines.push(`const cfg${i} = { retry: ${i}, mode: "strict" } as const`)
        break
      case 7:
        codeLines.push(
          `const settings${i} = { cache: true, strategy: "lru" } satisfies Record<string, unknown>`
        )
        break
      case 8:
        codeLines.push(
          `const city${i}: string = profile?.address?.city ?? "Unknown"`
        )
        break
      case 9:
        codeLines.push(`type Pair${i} = [head: string, ...tail: number[]]`)
        break
      case 10:
        codeLines.push(`function isUser${i}(v: unknown): v is User${i} { return typeof v === "object" && v !== null }`)
        break
      case 11:
        codeLines.push(
          `type EventName${i}<T extends string> = \`on\${Capitalize<T>}\``
        )
        break
    }
  }

  return codeLines.join('\n')
}

runLanguageBenchmark({
  languageName: 'TypeScript',
  lang: 'typescript',
  generateTestCode
})
