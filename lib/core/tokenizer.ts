import type { ParserContext, Token, TokenStream, TokenizerSpec } from './types'

/**
 * 创建初始解析上下文
 */
export const createInitialContext = <State extends string>(
  initialState: State
): ParserContext<State> => ({
  stateStack: [initialState],
  line: 1,
  col: 1
})

/**
 * 压栈
 */
export const pushState = <State extends string>(
  context: ParserContext<State>,
  state: State
): ParserContext<State> => ({
  ...context,
  stateStack: [...context.stateStack, state]
})

/**
 * 弹栈
 */
export const popState = <State extends string>(
  context: ParserContext<State>
): ParserContext<State> => {
  if (context.stateStack.length <= 1) {
    throw new Error('Cannot pop the last state from stack')
  }
  return {
    ...context,
    stateStack: context.stateStack.slice(0, -1)
  }
}

/**
 * 获取当前状态
 */
export const getCurrentState = <State extends string>(
  context: ParserContext<State>
): State => context.stateStack[context.stateStack.length - 1]!

/**
 * 拆分跨行 token
 */
export const splitTokenByLineBreak = <Scope extends string>(
  text: string,
  tokenScope: Scope,
  lineBreakScope: Scope,
  startLine: number,
  startCol: number
): Token<Scope>[] => {
  const tokens: Token<Scope>[] = []
  let remaining = text
  let currentLine = startLine
  let currentCol = startCol

  while (remaining.length > 0) {
    const lineBreakIndex = remaining.indexOf('\n')

    if (lineBreakIndex === -1) {
      tokens.push({
        text: remaining,
        scope: tokenScope,
        line: currentLine,
        col: [currentCol, currentCol + remaining.length - 1],
        style: {}
      })
      break
    }

    const isCRLF = lineBreakIndex > 0 && remaining[lineBreakIndex - 1] === '\r'
    const lineBreakChar = isCRLF
      ? remaining.slice(lineBreakIndex - 1, lineBreakIndex + 1)
      : remaining.slice(lineBreakIndex, lineBreakIndex + 1)

    const beforeLineBreak = isCRLF
      ? remaining.slice(0, lineBreakIndex - 1)
      : remaining.slice(0, lineBreakIndex)

    if (beforeLineBreak) {
      const beforeToken: Token<Scope> = {
        text: beforeLineBreak,
        scope: tokenScope,
        line: currentLine,
        col: [currentCol, currentCol + beforeLineBreak.length - 1],
        style: {}
      }
      tokens.push(beforeToken)
      currentCol = beforeToken.col[1] + 1
    }

    tokens.push({
      text: lineBreakChar,
      scope: lineBreakScope,
      line: currentLine,
      col: [currentCol, currentCol + lineBreakChar.length - 1],
      style: {}
    })

    currentLine += 1
    currentCol = 1

    const sliceStart = isCRLF ? lineBreakIndex - 1 : lineBreakIndex
    remaining = remaining.slice(sliceStart + lineBreakChar.length)
  }

  return tokens
}

/**
 * 匹配单个 token
 */
export const matchToken = <State extends string, Scope extends string>(
  code: string,
  context: ParserContext<State>,
  spec: TokenizerSpec<State, Scope>
): { token: Token<Scope>; newContext: ParserContext<State> } | null => {
  const currentState = getCurrentState(context)
  const rules = spec.rules[currentState]

  for (const rule of rules) {
    const match = rule.regex.exec(code)
    if (!match) continue

    const matchedText = match[0]
    const token: Token<Scope> = {
      text: matchedText,
      scope: rule.scope,
      line: context.line,
      col: [context.col, context.col + matchedText.length - 1],
      style: {}
    }

    let newContext: ParserContext<State> = { ...context }
    if (rule.pushState) {
      newContext = pushState(newContext, rule.pushState)
    }
    if (rule.popState) {
      newContext = popState(newContext)
    }
    newContext.col = token.col[1] + 1

    return { token, newContext }
  }

  if (code.length > 0) {
    const char = code[0]!
    const token: Token<Scope> = {
      text: char,
      scope: spec.fallbackScope,
      line: context.line,
      col: [context.col, context.col],
      style: {}
    }
    return { token, newContext: { ...context, col: context.col + 1 } }
  }

  return null
}

/**
 * 解析代码为二维 token 数组
 */
export const parse = <State extends string, Scope extends string>(
  code: string,
  spec: TokenizerSpec<State, Scope>
): TokenStream<Scope> => {
  const rows: Token<Scope>[][] = []
  let currentRowTokens: Token<Scope>[] = []
  let remainingCode = code
  let context = createInitialContext(spec.initialState)

  const lineBreakRegex = /^\r?\n/

  while (remainingCode.length > 0) {
    const lineBreakMatch = lineBreakRegex.exec(remainingCode)
    if (lineBreakMatch) {
      const lineBreakText = lineBreakMatch[0]
      currentRowTokens.push({
        text: lineBreakText,
        scope: spec.fallbackScope,
        line: context.line,
        col: [context.col, context.col + lineBreakText.length - 1],
        style: {}
      })

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

    const result = matchToken(remainingCode, context, spec)

    if (!result) {
      remainingCode = remainingCode.slice(1)
      context = {
        ...context,
        col: context.col + 1
      }
      continue
    }

    const { token, newContext } = result

    if (token.text.includes('\n')) {
      const splitTokens = splitTokenByLineBreak(
        token.text,
        token.scope,
        spec.fallbackScope,
        token.line,
        token.col[0]
      )

      for (const splitToken of splitTokens) {
        if (splitToken.text.includes('\n')) {
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
      currentRowTokens.push(token)
      context = {
        ...newContext,
        col: token.col[1] + 1
      }
    }

    remainingCode = remainingCode.slice(token.text.length)
  }

  if (currentRowTokens.length > 0) {
    rows.push(currentRowTokens)
  }

  return rows
}
