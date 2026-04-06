import { grammarRules } from './rule'
import { GrammarState, TokenType } from './type'
import type { GrammarRule, Token, TokenStream } from './type'

export const generateJavaScriptTokens = (code: string): TokenStream => {
  const tokens: TokenStream = [[]]
  let currentState: GrammarState = GrammarState.Initial
  let currentLine = 1 // 当前行号（从1开始）
  let currentCol = 0 // 当前列号（从0开始，对应字符起始位置）

  const codeLength = code.length

  let position = 0 // 当前字符位置（从0开始）
  while (position < codeLength) {
    const rules: GrammarRule[] = grammarRules[currentState]
    let matched = false // 是否匹配到规则

    for (const rule of rules) {
      const { regex, token, state } = rule

      regex.lastIndex = position // 重置正则表达式索引
      const match = regex.exec(code)

      if (!match) continue

      const matchedText = match[0]
      const tokenLength = matchedText.length

      // 计算当前token的起始列和结束列（结束列=起始列+长度，不包含结束位置
      const colStart = currentCol

      if (token === TokenType.Newline) {
        currentLine++
        currentCol = 0
        tokens.push([])
      } else if (token !== null) {
        const newToken: Token = {
          type: token,
          value: matchedText,
          col: [colStart, colStart + tokenLength],
          line: currentLine
        }
        tokens[currentLine - 1]!.push(newToken)
        currentCol += tokenLength
      }

      currentState = state
      position += tokenLength // 只更新索引，不创建新字符串
      matched = true

      break // 匹配到一个规则后，继续下一轮解析
    }

    if (!matched) {
      currentCol++
      position++
    }
  }

  return tokens
}
