import { generateJavaScriptTokens } from 'lib'

const tokens = generateJavaScriptTokens(`const a = 10
let b = 20
console.log(a + b)
function add(a, b) {
  return a + b
}`)
console.log(tokens)

const result = [
  [
    {
      type: 'token-keyword',
      value: 'const',
      col: [0, 5],
      line: 1
    },
    {
      type: 'token-whitespace',
      value: ' ',
      col: [5, 6],
      line: 1
    },
    {
      type: 'token-ident',
      value: 'a',
      col: [6, 7],
      line: 1
    },
    {
      type: 'token-whitespace',
      value: ' ',
      col: [7, 8],
      line: 1
    },
    {
      type: 'token-punctuation',
      value: '=',
      col: [8, 9],
      line: 1
    },
    {
      type: 'token-whitespace',
      value: ' ',
      col: [9, 10],
      line: 1
    },
    {
      type: 'token-number',
      value: '10',
      col: [10, 12],
      line: 1
    }
  ],
  [
    {
      type: 'token-keyword',
      value: 'let',
      col: [0, 3],
      line: 2
    },
    {
      type: 'token-whitespace',
      value: ' ',
      col: [3, 4],
      line: 2
    },
    {
      type: 'token-ident',
      value: 'b',
      col: [4, 5],
      line: 2
    },
    {
      type: 'token-whitespace',
      value: ' ',
      col: [5, 6],
      line: 2
    },
    {
      type: 'token-punctuation',
      value: '=',
      col: [6, 7],
      line: 2
    },
    {
      type: 'token-whitespace',
      value: ' ',
      col: [7, 8],
      line: 2
    },
    {
      type: 'token-number',
      value: '20',
      col: [8, 10],
      line: 2
    }
  ],
  [
    {
      type: 'token-ident',
      value: 'console',
      col: [0, 7],
      line: 3
    },
    {
      type: 'token-punctuation',
      value: '.',
      col: [7, 8],
      line: 3
    },
    {
      type: 'token-ident',
      value: 'log',
      col: [8, 11],
      line: 3
    },
    {
      type: 'token-punctuation',
      value: '(',
      col: [11, 12],
      line: 3
    },
    {
      type: 'token-ident',
      value: 'a',
      col: [12, 13],
      line: 3
    },
    {
      type: 'token-whitespace',
      value: ' ',
      col: [13, 14],
      line: 3
    },
    {
      type: 'token-punctuation',
      value: '+',
      col: [14, 15],
      line: 3
    },
    {
      type: 'token-whitespace',
      value: ' ',
      col: [15, 16],
      line: 3
    },
    {
      type: 'token-ident',
      value: 'b',
      col: [16, 17],
      line: 3
    },
    {
      type: 'token-punctuation',
      value: ')',
      col: [17, 18],
      line: 3
    }
  ],
  [
    {
      type: 'token-keyword',
      value: 'function',
      col: [0, 8],
      line: 4
    },
    {
      type: 'token-whitespace',
      value: ' ',
      col: [8, 9],
      line: 4
    },
    {
      type: 'token-ident',
      value: 'add',
      col: [9, 12],
      line: 4
    },
    {
      type: 'token-punctuation',
      value: '(',
      col: [12, 13],
      line: 4
    },
    {
      type: 'token-ident',
      value: 'a',
      col: [13, 14],
      line: 4
    },
    {
      type: 'token-punctuation',
      value: ',',
      col: [14, 15],
      line: 4
    },
    {
      type: 'token-whitespace',
      value: ' ',
      col: [15, 16],
      line: 4
    },
    {
      type: 'token-ident',
      value: 'b',
      col: [16, 17],
      line: 4
    },
    {
      type: 'token-punctuation',
      value: ')',
      col: [17, 18],
      line: 4
    },
    {
      type: 'token-whitespace',
      value: ' ',
      col: [18, 19],
      line: 4
    },
    {
      type: 'token-punctuation',
      value: '{',
      col: [19, 20],
      line: 4
    }
  ],
  [
    {
      type: 'token-whitespace',
      value: '  ',
      col: [0, 2],
      line: 5
    },
    {
      type: 'token-keyword',
      value: 'return',
      col: [2, 8],
      line: 5
    },
    {
      type: 'token-whitespace',
      value: ' ',
      col: [8, 9],
      line: 5
    },
    {
      type: 'token-ident',
      value: 'a',
      col: [9, 10],
      line: 5
    },
    {
      type: 'token-whitespace',
      value: ' ',
      col: [10, 11],
      line: 5
    },
    {
      type: 'token-punctuation',
      value: '+',
      col: [11, 12],
      line: 5
    },
    {
      type: 'token-whitespace',
      value: ' ',
      col: [12, 13],
      line: 5
    },
    {
      type: 'token-ident',
      value: 'b',
      col: [13, 14],
      line: 5
    }
  ],
  [
    {
      type: 'token-punctuation',
      value: '}',
      col: [0, 1],
      line: 6
    }
  ]
]
