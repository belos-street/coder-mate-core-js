import type { GrammarRulesMap } from './type'

export const grammarRules: GrammarRulesMap = {
  initial: [
    { regex: /(\/\/.*)/y, token: 'token-comment', state: 'initial' },
    { regex: /(".*?"|'.*?')/y, token: 'token-string', state: 'initial' },
    {
      regex: /(let|const|var|function|return|if|else|for|while)/y,
      token: 'token-keyword',
      state: 'initial'
    },
    { regex: /(\d+(\.\d+)?)/y, token: 'token-number', state: 'initial' },
    {
      regex: /([a-zA-Z_$][a-zA-Z0-9_$]*)/y,
      token: 'token-identifier',
      state: 'initial'
    },
    {
      regex: /([;,.(){}[\]=+\-*\/<>])/y,
      token: 'token-punctuation',
      state: 'initial'
    },
    { regex: /( +|\t+)/y, token: 'token-whitespace', state: 'initial' },
    { regex: /(\n)/y, token: 'token-newline', state: 'initial' } // 换行符（仅用于行号处理，不生成token）
  ],
  template: [],
  'template-expression': [],
  'comment-multiline': [],
  'comment-singleline': [],
  regex: []
}
