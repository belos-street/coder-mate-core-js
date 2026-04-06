import { GrammarState, TokenType } from './type'
import type { GrammarRule, GrammarRulesMap } from './type'

function createExpressionRules(targetState: GrammarState): GrammarRule[] {
  return [
    {
      regex: /\b(true|false|null|undefined|this)\b/y,
      token: TokenType.Literal,
      state: targetState
    },
    {
      regex:
        /0[bB][01](?:_?[01])*n?|0[oO][0-7](?:_?[0-7])*n?|0[xX][0-9a-fA-F](?:_?[0-9a-fA-F])*n?|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?n?|\d+(?:_\d+)*n/y,
      token: TokenType.Number,
      state: targetState
    },
    {
      regex: /([a-zA-Z_$][a-zA-Z0-9_$]*)/y,
      token: TokenType.Identifier,
      state: targetState
    },
    {
      regex: /(".*?"|'.*?')/y,
      token: TokenType.String,
      state: targetState
    },
    {
      regex:
        /(===|!==|&&|\|\||\?\?|\?\.|==|!=|<=|>=|<<|>>|\+\+|--|\*\*|=>|\.\.\.)/y,
      token: TokenType.Operator,
      state: targetState
    },
    {
      regex: /([+\-*\/%=<>!&|^~?:@])/y,
      token: TokenType.Operator,
      state: targetState
    },
    {
      regex: /([;,.(){}[\]])/y,
      token: TokenType.Punctuation,
      state: targetState
    },
    {
      regex: /([ \t]+)/y,
      token: TokenType.Whitespace,
      state: targetState
    },
    { regex: /(\n)/y, token: TokenType.Newline, state: targetState }
  ]
}

export const grammarRules: GrammarRulesMap = {
  [GrammarState.Initial]: [
    {
      regex: /\/\*[\s\S]*?\*\//y,
      token: TokenType.Comment,
      state: GrammarState.Initial
    },
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
    {
      regex: /(`)/y,
      token: null,
      state: GrammarState.Template
    },
    {
      regex:
        /(break|continue|switch|case|default|try|catch|finally|throw|new|delete|void|typeof|in|instanceof)\b/y,
      token: TokenType.Keyword,
      state: GrammarState.Initial
    },
    {
      regex: /(async|await|yield|function)/y,
      token: TokenType.Keyword,
      state: GrammarState.Initial
    },
    {
      regex: /(class|extends|super|static|get|set|constructor)/y,
      token: TokenType.Keyword,
      state: GrammarState.Initial
    },
    {
      regex: /(import|export|from|as)/y,
      token: TokenType.Keyword,
      state: GrammarState.Initial
    },
    {
      regex: /(let|const|var|return|if|else|for|while|of)/y,
      token: TokenType.Keyword,
      state: GrammarState.Initial
    },
    {
      regex: /(>>>=)/y,
      token: TokenType.Operator,
      state: GrammarState.Initial
    },
    {
      regex:
        /(>>>=|===|!==|&&=|\|\|=|\?\?=|\*\*|<<=|>>=|>>>|\+\+|--|==|!=|<=|>=|&&|\|\||\?\?|\?\.|<<|>>|=>|\.\.\.|\+=|-=|\*=|\/=|%=|&=|\|=|\^=)/y,
      token: TokenType.Operator,
      state: GrammarState.Initial
    },
    ...createExpressionRules(GrammarState.Initial)
  ],
  [GrammarState.Template]: [
    {
      regex: /(\$\{)/y,
      token: null,
      state: GrammarState.TemplateExpression
    },
    {
      regex: /([^`$\\]+|\\.)+/y,
      token: TokenType.TemplateString,
      state: GrammarState.Template
    },
    {
      regex: /(`)/y,
      token: null,
      state: GrammarState.Initial
    }
  ],
  [GrammarState.TemplateExpression]: [
    {
      regex: /(\$\{)/y,
      token: null,
      state: GrammarState.TemplateExpression
    },
    {
      regex: /(\})/y,
      token: null,
      state: GrammarState.Template
    },
    {
      regex: /(`)/y,
      token: TokenType.TemplateString,
      state: GrammarState.Template
    },
    ...createExpressionRules(GrammarState.TemplateExpression)
  ],
  [GrammarState.CommentMultiline]: [],
  [GrammarState.CommentSingleline]: [],
  [GrammarState.Regex]: []
}
