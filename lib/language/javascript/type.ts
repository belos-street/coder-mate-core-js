// Token类型：所有可能的词法单元类型
export type TokenType =
  | 'token-comment' // 注释
  | 'token-string' // 字符串
  | 'token-template-string' // 模板字符串
  | 'token-template-expression' // 模板表达式
  | 'token-keyword' // 关键字
  | 'token-literal' // 字面量
  | 'token-number' // 数字
  | 'token-identifier' // 标识符
  | 'token-operator' // 运算符
  | 'token-punctuation' // 标点符号
  | 'token-whitespace' // 空白字符
  | 'token-newline' // 换行符
  | 'token-regex' // 正则表达式
  | 'token-unknown' // 未知类型

// Token结构：单个词法单元的完整信息
export interface Token {
  type: TokenType // 类型
  value: string // 原始文本
  col: [number, number] // 列范围 [起始, 结束)
  line: number // 行号（从1开始）
}

// 状态机状态：词法分析器的解析状态
export type GrammarState =
  | 'initial' // 初始状态
  | 'template' // 模板字符串内
  | 'template-expression' // 模板表达式内
  | 'comment-multiline' // 多行注释内
  | 'comment-singleline' // 单行注释内
  | 'regex' // 正则表达式内

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
