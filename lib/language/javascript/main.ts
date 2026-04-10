import type {
  GrammarState,
  ParserContext,
  Token,
  TokenScope,
  TokenStream
} from './type'
import { GRAMMAR_RULES } from './rule'
import { SCOPE_TO_STYLE } from './style'
import { escapeHtml } from './util'

/**
 * ES2020 语法高亮器 - 解析引擎
 * 采用函数式编程风格，所有函数均为纯函数
 */

// ==================== 状态栈管理 ====================

/**
 * 创建初始解析上下文
 * @returns 初始上下文对象
 */
export const createInitialContext = (): ParserContext => ({
  stateStack: ['global'],
  line: 1,
  col: 1
})

/**
 * 压栈：将新状态添加到状态栈顶
 * @param context 当前上下文
 * @param state 要压入的状态
 * @returns 新的上下文（状态栈已更新）
 */
export const pushState = (
  context: ParserContext,
  state: GrammarState
): ParserContext => ({
  ...context,
  stateStack: [...context.stateStack, state]
})

/**
 * 弹栈：移除状态栈顶的状态
 * @param context 当前上下文
 * @returns 新的上下文（状态栈已移除顶部状态）
 * @throws 如果状态栈只剩一个状态，抛出错误
 */
export const popState = (context: ParserContext): ParserContext => {
  if (context.stateStack.length <= 1) {
    throw new Error('Cannot pop the last state from stack')
  }
  return {
    ...context,
    stateStack: context.stateStack.slice(0, -1)
  }
}

/**
 * 获取当前状态（栈顶状态）
 * @param context 当前上下文
 * @returns 当前状态
 */
export const getCurrentState = (context: ParserContext): GrammarState => {
  return context.stateStack[context.stateStack.length - 1]!
}

// ==================== Token 匹配和拆分 ====================

/**
 * 拆分包含换行符的 Token 并补充行列属性
 * 处理 CRLF (`\r\n`) 和 LF (`\n`) 两种换行符
 *
 * @param text 包含换行符的 Token 文本
 * @param scope Token 作用域
 * @param startLine 起始行号
 * @param startCol 起始列号
 * @returns 拆分后的 Token 列表
 */
export const splitTokenByLineBreak = (
  text: string,
  scope: TokenScope,
  startLine: number,
  startCol: number
): Token[] => {
  const tokens: Token[] = []
  let remaining = text
  let currentLine = startLine
  let currentCol = startCol

  while (remaining.length > 0) {
    const lineBreakIndex = remaining.indexOf('\n')

    if (lineBreakIndex === -1) {
      // 无换行符：处理最后一段文本
      const token: Token = {
        text: remaining,
        scope: scope,
        line: currentLine,
        col: [currentCol, currentCol + remaining.length - 1]
      }
      tokens.push(token)
      break
    }

    // 有换行符：拆分「换行符前内容」+「换行符」+「剩余文本」

    // 2. 处理换行符（兼容 \n 和 \r\n）
    const isCRLF = lineBreakIndex > 0 && remaining[lineBreakIndex - 1] === '\r'
    const lineBreakChar = isCRLF
      ? remaining.slice(lineBreakIndex - 1, lineBreakIndex + 1)
      : remaining.slice(lineBreakIndex, lineBreakIndex + 1)

    // 1. 处理换行符前的内容（可能为空）
    const beforeLineBreak = isCRLF
      ? remaining.slice(0, lineBreakIndex - 1)
      : remaining.slice(0, lineBreakIndex)
    if (beforeLineBreak) {
      const beforeToken: Token = {
        text: beforeLineBreak,
        scope: scope,
        line: currentLine,
        col: [currentCol, currentCol + beforeLineBreak.length - 1]
      }
      tokens.push(beforeToken)
      currentCol = beforeToken.col[1] + 1
    }

    const lineBreakToken: Token = {
      text: lineBreakChar,
      scope: 'default',
      line: currentLine,
      col: [currentCol, currentCol + lineBreakChar.length - 1]
    }
    tokens.push(lineBreakToken)

    // 3. 换行后更新状态：行号+1，列号重置为1
    currentLine += 1
    currentCol = 1

    // 4. 截断剩余文本（跳过已处理的换行符）
    const sliceStart = isCRLF ? lineBreakIndex - 1 : lineBreakIndex
    remaining = remaining.slice(sliceStart + lineBreakChar.length)
  }

  return tokens
}

/**
 * 匹配单个 token
 * 根据当前状态匹配一个 token，返回 token 和更新后的上下文
 *
 * @param code 剩余代码
 * @param context 当前上下文
 * @returns 匹配结果 { token, newContext } 或 null（无匹配）
 */
export const matchToken = (
  code: string,
  context: ParserContext
): { token: Token; newContext: ParserContext } | null => {
  const currentState = getCurrentState(context)
  const rules = GRAMMAR_RULES[currentState]

  // 遍历规则，尝试匹配
  for (const rule of rules) {
    const match = rule.regex.exec(code)

    if (match) {
      const matchedText = match[0]

      // 创建 token
      const token: Token = {
        text: matchedText,
        scope: rule.scope,
        line: context.line,
        col: [context.col, context.col + matchedText.length - 1]
      }

      // 更新上下文
      let newContext = { ...context }

      // 处理状态栈
      if (rule.pushState) {
        newContext = pushState(newContext, rule.pushState)
      }
      if (rule.popState) {
        newContext = popState(newContext)
      }

      // 更新列号
      newContext.col = token.col[1] + 1

      return { token, newContext }
    }
  }

  // 无匹配规则：取单个字符作为兜底 token
  if (code.length > 0) {
    const char = code[0]!
    const token: Token = {
      text: char,
      scope: 'default',
      line: context.line,
      col: [context.col, context.col]
    }
    return { token, newContext: { ...context, col: context.col + 1 } }
  }

  return null
}

// ==================== 主解析流程 ====================

/**
 * 主解析函数：解析代码为二维 Token 数组
 *
 * @param code 要解析的 ES2020 代码
 * @returns 二维 Token 数组（按行组织）
 */
export const parse = (code: string): TokenStream => {
  const rows: Token[][] = []
  let currentRowTokens: Token[] = []
  let remainingCode = code
  let context = createInitialContext()

  const lineBreakRegex = /^\r?\n/

  while (remainingCode.length > 0) {
    // 1. 优先处理换行符：切换到下一行
    const lineBreakMatch = lineBreakRegex.exec(remainingCode)
    if (lineBreakMatch) {
      const lineBreakText = lineBreakMatch[0]

      // 生成换行符 Token
      const lineBreakToken: Token = {
        text: lineBreakText,
        scope: 'default',
        line: context.line,
        col: [context.col, context.col + lineBreakText.length - 1]
      }
      currentRowTokens.push(lineBreakToken)

      // 换行后：行号+1，列号重置为1
      rows.push(currentRowTokens)
      currentRowTokens = []
      context = {
        ...context,
        line: context.line + 1,
        col: 1
      }

      remainingCode = remainingCode.slice(lineBreakText.length)
      continue
    }

    // 2. 匹配 Token
    const result = matchToken(remainingCode, context)

    if (result) {
      const { token, newContext } = result

      // 检查是否跨行（包含换行符）
      if (token.text.includes('\n')) {
        // 拆分跨行 Token
        const splitTokens = splitTokenByLineBreak(
          token.text,
          token.scope,
          token.line,
          token.col[0]
        )

        // 处理拆分后的每个 Token
        for (const splitToken of splitTokens) {
          if (splitToken.text.includes('\n')) {
            // 换行符 Token：加入当前行，切换行号/列号
            currentRowTokens.push(splitToken)
            rows.push(currentRowTokens)
            currentRowTokens = []
            context = {
              ...context,
              stateStack: newContext.stateStack,
              line: splitToken.line + 1,
              col: 1
            }
          } else {
            // 普通 Token：加入当前行，更新列号
            currentRowTokens.push(splitToken)
            context = {
              ...context,
              stateStack: newContext.stateStack,
              line: splitToken.line,
              col: splitToken.col[1] + 1
            }
          }
        }
      } else {
        // 非跨行 Token：加入当前行，更新列号
        currentRowTokens.push(token)
        context = {
          ...newContext,
          col: token.col[1] + 1
        }
      }

      // 截断剩余代码
      remainingCode = remainingCode.slice(token.text.length)
    } else {
      // 无匹配：跳过单个字符（理论上不应该发生，因为 matchToken 有兜底）
      remainingCode = remainingCode.slice(1)
      context = {
        ...context,
        col: context.col + 1
      }
    }
  }

  // 3. 把最后一行（无换行符结尾）加入总行数组
  if (currentRowTokens.length > 0) {
    rows.push(currentRowTokens)
  }

  return rows
}

/**
 * 生成高亮 HTML
 *
 * @param code ES2020 代码
 * @returns 高亮后的 HTML 字符串
 */
export const highlight = (code: string): string => {
  const rows = parse(code)

  // 逐行生成 HTML
  const rowsHtml = rows
    .map((rowTokens, rowIndex) => {
      const lineTokensHtml = rowTokens
        .map((token) => {
          const style = SCOPE_TO_STYLE[token.scope] || SCOPE_TO_STYLE['default']
          return `<span style="${style}">${escapeHtml(token.text)}</span>`
        })
        .join('')

      // 给每行加行容器
      return `<div class="code-line line-${rowIndex + 1}">${lineTokensHtml}</div>`
    })
    .join('')

  return `<pre style="background: #1E1E1E; padding: 16px; border-radius: 8px; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.5; white-space: pre;"><code>${rowsHtml}</code></pre>`
}
