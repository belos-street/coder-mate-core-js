import { heapStats } from 'bun:jsc'

export interface PerformanceResult {
  name: string
  lines: number
  parseTime: number
  highlightTime: number
  totalTime: number
  throughput: number
}

export interface TestCase {
  name: string
  lines: number
}

export interface BenchmarkOptions {
  languageName: string
  lang: string
  generateTestCode: (lines: number) => string
  testCases?: TestCase[]
}

const DEFAULT_TEST_CASES: TestCase[] = [
  { name: '小文件 (100 行)', lines: 100 },
  { name: '中等文件 (1,000 行)', lines: 1000 },
  { name: '大文件 (10,000 行)', lines: 10000 },
  { name: '超大文件 (50,000 行)', lines: 50000 }
]

const formatResult = (result: PerformanceResult): string => {
  return `
${result.name}:
  行数: ${result.lines.toLocaleString()}
  解析时间: ${result.parseTime.toFixed(2)}ms
  高亮时间: ${result.highlightTime.toFixed(2)}ms
  总时间: ${result.totalTime.toFixed(2)}ms
  吞吐量: ${result.throughput.toFixed(0)} 行/秒
`
}

export const runLanguageBenchmark = async ({
  languageName,
  lang,
  generateTestCode,
  testCases = DEFAULT_TEST_CASES
}: BenchmarkOptions): Promise<void> => {
  const { createHighlighter } = await import('../lib/index')
  const highlighter = createHighlighter({ theme: 'dark-plus' })

  console.log(`🚀 开始 ${languageName} 性能测试...\n`)

  const results: PerformanceResult[] = []

  for (const testCase of testCases) {
    console.log(`生成测试代码: ${testCase.name}...`)
    const code = generateTestCode(testCase.lines)
    const lines = code.split('\n').length

    console.log(`测试: ${testCase.name}`)

    const parseStart = performance.now()
    const tokens = await highlighter.codeToTokens(code, { lang })
    const parseEnd = performance.now()
    const parseTime = parseEnd - parseStart

    const highlightStart = performance.now()
    const html = await highlighter.codeToHtml(code, { lang })
    const highlightEnd = performance.now()
    const highlightTime = highlightEnd - highlightStart

    void tokens
    void html

    const totalTime = parseTime + highlightTime
    const throughput = lines / (totalTime / 1000)

    const result: PerformanceResult = {
      name: testCase.name,
      lines,
      parseTime,
      highlightTime,
      totalTime,
      throughput
    }
    results.push(result)
    console.log(formatResult(result))
  }

  console.log('\n📊 性能总结:\n')
  console.table(
    results.map((r) => ({
      测试用例: r.name,
      行数: r.lines.toLocaleString(),
      '解析时间(ms)': r.parseTime.toFixed(2),
      '高亮时间(ms)': r.highlightTime.toFixed(2),
      '总时间(ms)': r.totalTime.toFixed(2),
      '吞吐量(行/秒)': r.throughput.toFixed(0)
    }))
  )

  const smallFileResult = results[0]!
  const largeFileResult = results[results.length - 1]!
  console.log('\n性能基准:')
  console.log(
    `- 小文件 (${smallFileResult.lines} 行): ${smallFileResult.totalTime.toFixed(2)}ms`
  )
  console.log(
    `- 大文件 (${largeFileResult.lines} 行): ${largeFileResult.totalTime.toFixed(2)}ms`
  )
  console.log(`- 平均吞吐量: ${largeFileResult.throughput.toFixed(0)} 行/秒`)

  console.log('\n性能建议:')
  if (largeFileResult.throughput < 10000) {
    console.log('⚠️  吞吐量较低，建议优化正则表达式匹配逻辑')
  } else if (largeFileResult.throughput < 50000) {
    console.log('✅ 性能良好，可以处理大多数文件')
  } else {
    console.log('🎉 性能优秀，可以快速处理大型文件')
  }

  console.log('\n💾 内存测试...\n')
  const memoryBefore = heapStats()
  const memoryCode = generateTestCode(10000)
  const memoryTokens = await highlighter.codeToTokens(memoryCode, { lang })
  const memoryHtml = await highlighter.codeToHtml(memoryCode, { lang })
  const memoryAfter = heapStats()

  void memoryTokens
  void memoryHtml

  console.log('内存使用情况:')
  console.log(
    `- 堆大小: ${((memoryAfter.heapSize - memoryBefore.heapSize) / 1024 / 1024).toFixed(2)} MB`
  )
  console.log(
    `- 堆容量: ${((memoryAfter.heapCapacity - memoryBefore.heapCapacity) / 1024 / 1024).toFixed(2)} MB`
  )
  console.log(
    `- 额外内存: ${((memoryAfter.extraMemorySize - memoryBefore.extraMemorySize) / 1024 / 1024).toFixed(2)} MB`
  )
  console.log(
    `- 对象数量: ${memoryAfter.objectCount - memoryBefore.objectCount}`
  )

  const heapIncrease =
    (memoryAfter.heapSize - memoryBefore.heapSize) / 1024 / 1024
  if (heapIncrease > 100) {
    console.log('⚠️  内存使用较高，建议检查是否有内存泄漏')
  } else if (heapIncrease > 50) {
    console.log('✅ 内存使用正常')
  } else {
    console.log('🎉 内存使用优秀')
  }

  console.log(`\n✅ ${languageName} 性能测试完成！`)
}
