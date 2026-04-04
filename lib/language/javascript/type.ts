// Token类型常量
export const TokenType = {
  Comment: 'token-comment',
  String: 'token-string',
  TemplateString: 'token-template-string',
  TemplateExpression: 'token-template-expression',
  Keyword: 'token-keyword',
  Literal: 'token-literal',
  Number: 'token-number',
  Identifier: 'token-identifier',
  Operator: 'token-operator',
  Punctuation: 'token-punctuation',
  Whitespace: 'token-whitespace',
  Newline: 'token-newline',
  Regex: 'token-regex',
  Unknown: 'token-unknown'
} as const

// 推导TokenType类型
export type TokenType = (typeof TokenType)[keyof typeof TokenType]

// 状态机状态常量
export const GrammarState = {
  Initial: 'initial',
  Template: 'template',
  TemplateExpression: 'template-expression',
  CommentMultiline: 'comment-multiline',
  CommentSingleline: 'comment-singleline',
  Regex: 'regex'
} as const

// 推导GrammarState类型
export type GrammarState = (typeof GrammarState)[keyof typeof GrammarState]

// Token结构：单个词法单元的完整信息
export interface Token {
  type: TokenType // 类型
  value: string // 原始文本
  col: [number, number] // 列范围 [起始, 结束)
  line: number // 行号（从1开始）
}

// 词法规则：单个正则匹配规则
export interface GrammarRule {
  regex: RegExp // 匹配正则
  token: TokenType | null // 对应Token类型，null表示不生成Token
  state: GrammarState // 匹配后转移到的状态
}

// 规则映射表：状态到规则列表的映射
export type GrammarRulesMap = Record<GrammarState, GrammarRule[]>

// Token流：按行组织的Token序列
export type TokenStream = Token[][]
