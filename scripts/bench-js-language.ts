import { parse } from 'lib/language/javascript'
import { highlightJavaScript as highlight } from '@/render'
import { heapStats } from 'bun:jsc'

/**
 * 性能测试脚本
 * 测试解析速度和内存使用情况
 */

// ==================== 测试数据生成 ====================

/**
 * 生成指定行数的测试代码
 */
function generateTestCode(lines: number): string {
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

// ==================== 性能测试函数 ====================

interface PerformanceResult {
  name: string
  lines: number
  parseTime: number
  highlightTime: number
  totalTime: number
  throughput: number // lines per second
}

function measurePerformance(name: string, code: string): PerformanceResult {
  const lines = code.split('\n').length

  // 测试 parse 性能
  const parseStart = performance.now()
  const tokens = parse(code)
  const parseEnd = performance.now()
  const parseTime = parseEnd - parseStart

  // 测试 highlight 性能
  const highlightStart = performance.now()
  const html = highlight(code)
  const highlightEnd = performance.now()
  const highlightTime = highlightEnd - highlightStart

  const totalTime = parseTime + highlightTime
  const throughput = lines / (totalTime / 1000)

  return {
    name,
    lines,
    parseTime,
    highlightTime,
    totalTime,
    throughput
  }
}

function formatResult(result: PerformanceResult): string {
  return `
${result.name}:
  行数: ${result.lines.toLocaleString()}
  解析时间: ${result.parseTime.toFixed(2)}ms
  高亮时间: ${result.highlightTime.toFixed(2)}ms
  总时间: ${result.totalTime.toFixed(2)}ms
  吞吐量: ${result.throughput.toFixed(0)} 行/秒
`
}

// ==================== 运行性能测试 ====================

console.log('🚀 开始性能测试...\n')

// 测试不同规模的代码
const testCases = [
  { name: '小文件 (100 行)', lines: 100 },
  { name: '中等文件 (1,000 行)', lines: 1000 },
  { name: '大文件 (10,000 行)', lines: 10000 },
  { name: '超大文件 (50,000 行)', lines: 50000 }
]

const results: PerformanceResult[] = []

for (const testCase of testCases) {
  console.log(`生成测试代码: ${testCase.name}...`)
  const code = generateTestCode(testCase.lines)

  console.log(`测试: ${testCase.name}`)
  const result = measurePerformance(testCase.name, code)
  results.push(result)
  console.log(formatResult(result))
}

// ==================== 性能总结 ====================

console.log('\n📊 性能总结:\n')

console.log('测试结果:')
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

// 性能基准
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

// 性能建议
console.log('\n性能建议:')
if (largeFileResult.throughput < 10000) {
  console.log('⚠️  吞吐量较低，建议优化正则表达式匹配逻辑')
} else if (largeFileResult.throughput < 50000) {
  console.log('✅ 性能良好，可以处理大多数文件')
} else {
  console.log('🎉 性能优秀，可以快速处理大型文件')
}

// ==================== 内存测试 ====================

console.log('\n💾 内存测试...\n')

const memoryBefore = heapStats()
const testCode = generateTestCode(10000)
const tokens = parse(testCode)
const html = highlight(testCode)
const memoryAfter = heapStats()

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
console.log(`- 对象数量: ${memoryAfter.objectCount - memoryBefore.objectCount}`)

const heapIncrease =
  (memoryAfter.heapSize - memoryBefore.heapSize) / 1024 / 1024
if (heapIncrease > 100) {
  console.log('⚠️  内存使用较高，建议检查是否有内存泄漏')
} else if (heapIncrease > 50) {
  console.log('✅ 内存使用正常')
} else {
  console.log('🎉 内存使用优秀')
}

console.log('\n✅ 性能测试完成！')
