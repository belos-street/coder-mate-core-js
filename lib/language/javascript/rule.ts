import { GrammarState, TokenType } from './type'
import type { GrammarRulesMap } from './type'

export const grammarRules: GrammarRulesMap = {
  [GrammarState.Initial]: [
    {
      regex: /(\/\/.*)/y,
      token: TokenType.Comment,
      state: GrammarState.Initial
    },
    {
      regex: /(".*?"|'.*?')/y,
      token: TokenType.String,
      state: GrammarState.Initial
    },

    // 关键字 - 控制流
    {
      regex:
        /(break|continue|switch|case|default|try|catch|finally|throw|new|delete|void|typeof|in|instanceof)\b/y,
      token: TokenType.Keyword,
      state: GrammarState.Initial
    },

    // 关键字 - 函数和异步
    {
      regex: /(async|await|yield|function)/y,
      token: TokenType.Keyword,
      state: GrammarState.Initial
    },

    // 关键字 - 类相关
    {
      regex: /(class|extends|super|static|get|set|constructor)/y,
      token: TokenType.Keyword,
      state: GrammarState.Initial
    },

    // 关键字 - 模块
    {
      regex: /(import|export|from|as)/y,
      token: TokenType.Keyword,
      state: GrammarState.Initial
    },

    // 关键字 - 声明和流程
    {
      regex: /(let|const|var|return|if|else|for|while|of)/y,
      token: TokenType.Keyword,
      state: GrammarState.Initial
    },

    // 字面量
    {
      regex: /\b(true|false|null|undefined|this)\b/y,
      token: TokenType.Literal,
      state: GrammarState.Initial
    },

    {
      regex:
        /0[bB][01](?:_?[01])*n?|0[oO][0-7](?:_?[0-7])*n?|0[xX][0-9a-fA-F](?:_?[0-9a-fA-F])*n?|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?n?|\d+(?:_\d+)*n/y,
      token: TokenType.Number,
      state: GrammarState.Initial
    },
    {
      regex: /([a-zA-Z_$][a-zA-Z0-9_$]*)/y,
      token: TokenType.Identifier,
      state: GrammarState.Initial
    },

    // 运算符 - 按长度排序，从长到短
    // 三字符运算符
    {
      regex: /(>>>=)/y,
      token: TokenType.Operator,
      state: GrammarState.Initial
    },

    // 两字符运算符（包含赋值运算符，需要放在单字符前面）
    {
      regex:
        /(>>>=|===|!==|&&=|\|\|=|\?\?=|\*\*|<<=|>>=|>>>|\+\+|--|==|!=|<=|>=|&&|\|\||\?\?|\?\.|<<|>>|=>|\.\.\.|\+=|-=|\*=|\/=|%=|&=|\|=|\^=)/y,
      token: TokenType.Operator,
      state: GrammarState.Initial
    },

    // 单字符运算符
    {
      regex: /([+\-*\/%=<>!&|^~?:@])/y,
      token: TokenType.Operator,
      state: GrammarState.Initial
    },

    // 标点符号
    {
      regex: /([;,.(){}[\]])/y,
      token: TokenType.Punctuation,
      state: GrammarState.Initial
    },
    {
      regex: /([ \t]+)/y,
      token: TokenType.Whitespace,
      state: GrammarState.Initial
    },
    { regex: /(\n)/y, token: TokenType.Newline, state: GrammarState.Initial }
  ],
  [GrammarState.Template]: [],
  [GrammarState.TemplateExpression]: [],
  [GrammarState.CommentMultiline]: [],
  [GrammarState.CommentSingleline]: [],
  [GrammarState.Regex]: []
}
