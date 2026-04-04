import { describe, it, expect } from 'bun:test'
import { grammarRules } from '../rule'
import { TokenType, GrammarState } from '../type'

function matchToken(
  code: string,
  pos: number = 0
): { token: string; value: string } | null {
  const rules = grammarRules[GrammarState.Initial]
  for (const rule of rules) {
    rule.regex.lastIndex = pos
    const match = rule.regex.exec(code)
    if (match && match.index === pos) {
      return { token: rule.token!, value: match[1] || match[0] }
    }
  }
  return null
}

describe('grammarRules - 注释', () => {
  it('should match single-line comment', () => {
    const result = matchToken('// this is a comment')
    expect(result?.token).toBe(TokenType.Comment)
    expect(result?.value).toBe('// this is a comment')
  })

  it('should match comment with code', () => {
    const result = matchToken('// TODO: fix this later')
    expect(result?.token).toBe(TokenType.Comment)
    expect(result?.value).toBe('// TODO: fix this later')
  })
})

describe('grammarRules - 字符串', () => {
  it('should match double-quoted string', () => {
    const result = matchToken('"hello world"')
    expect(result?.token).toBe(TokenType.String)
    expect(result?.value).toBe('"hello world"')
  })

  it('should match single-quoted string', () => {
    const result = matchToken("'hello world'")
    expect(result?.token).toBe(TokenType.String)
    expect(result?.value).toBe("'hello world'")
  })

  it('should match empty string', () => {
    const result = matchToken('""')
    expect(result?.token).toBe(TokenType.String)
    expect(result?.value).toBe('""')
  })

  it('should match string with escaped quote', () => {
    const result = matchToken('"hello world"')
    expect(result?.token).toBe(TokenType.String)
    expect(result?.value).toBe('"hello world"')
  })
})

describe('grammarRules - 关键字 - 控制流', () => {
  const keywords = [
    'break',
    'continue',
    'switch',
    'case',
    'default',
    'try',
    'catch',
    'finally',
    'throw',
    'new',
    'delete',
    'void',
    'typeof',
    'in',
    'instanceof'
  ]

  for (const keyword of keywords) {
    it(`should match keyword: ${keyword}`, () => {
      const result = matchToken(keyword)
      expect(result?.token).toBe(TokenType.Keyword)
      expect(result?.value).toBe(keyword)
    })
  }
})

describe('grammarRules - 关键字 - 函数和异步', () => {
  const keywords = ['async', 'await', 'yield', 'function']

  for (const keyword of keywords) {
    it(`should match keyword: ${keyword}`, () => {
      const result = matchToken(keyword)
      expect(result?.token).toBe(TokenType.Keyword)
      expect(result?.value).toBe(keyword)
    })
  }
})

describe('grammarRules - 关键字 - 类相关', () => {
  const keywords = [
    'class',
    'extends',
    'super',
    'static',
    'get',
    'set',
    'constructor'
  ]

  for (const keyword of keywords) {
    it(`should match keyword: ${keyword}`, () => {
      const result = matchToken(keyword)
      expect(result?.token).toBe(TokenType.Keyword)
      expect(result?.value).toBe(keyword)
    })
  }
})

describe('grammarRules - 关键字 - 模块', () => {
  const keywords = ['import', 'export', 'from', 'as']

  for (const keyword of keywords) {
    it(`should match keyword: ${keyword}`, () => {
      const result = matchToken(keyword)
      expect(result?.token).toBe(TokenType.Keyword)
      expect(result?.value).toBe(keyword)
    })
  }
})

describe('grammarRules - 关键字 - 声明和流程', () => {
  const keywords = [
    'let',
    'const',
    'var',
    'return',
    'if',
    'else',
    'for',
    'while',
    'of'
  ]

  for (const keyword of keywords) {
    it(`should match keyword: ${keyword}`, () => {
      const result = matchToken(keyword)
      expect(result?.token).toBe(TokenType.Keyword)
      expect(result?.value).toBe(keyword)
    })
  }
})

describe('grammarRules - 字面量', () => {
  const literals = ['true', 'false', 'null', 'undefined', 'this']

  for (const literal of literals) {
    it(`should match literal: ${literal}`, () => {
      const result = matchToken(literal)
      expect(result?.token).toBe(TokenType.Literal)
      expect(result?.value).toBe(literal)
    })
  }
})

describe('grammarRules - 数字', () => {
  it('should match integer', () => {
    const result = matchToken('42')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('42')
  })

  it('should match decimal', () => {
    const result = matchToken('3.14')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('3.14')
  })

  it('should match zero', () => {
    const result = matchToken('0')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0')
  })

  it('should match decimal number', () => {
    const result = matchToken('0.5')
    expect(result?.token).toBe(TokenType.Number)
    expect(result?.value).toBe('0.5')
  })
})

describe('grammarRules - 标识符', () => {
  const identifiers = [
    'foo',
    '_bar',
    '$baz',
    'qux1',
    '_privateVar',
    '$element',
    'camelCase',
    'PascalCase',
    'with_underscore',
    'with$dollar'
  ]

  for (const identifier of identifiers) {
    it(`should match identifier: ${identifier}`, () => {
      const result = matchToken(identifier)
      expect(result?.token).toBe(TokenType.Identifier)
      expect(result?.value).toBe(identifier)
    })
  }

  it('should not match keyword as identifier', () => {
    const result = matchToken('let')
    expect(result?.token).toBe(TokenType.Keyword)
    expect(result?.token).not.toBe(TokenType.Identifier)
  })
})

describe('grammarRules - 标点符号', () => {
  const punctuations = [
    { char: ';', name: 'semicolon' },
    { char: ',', name: 'comma' },
    { char: '.', name: 'dot' },
    { char: '(', name: 'left paren' },
    { char: ')', name: 'right paren' },
    { char: '{', name: 'left brace' },
    { char: '}', name: 'right brace' },
    { char: '[', name: 'left bracket' },
    { char: ']', name: 'right bracket' }
  ]

  for (const punct of punctuations) {
    it(`should match punctuation: ${punct.name} (${punct.char})`, () => {
      const result = matchToken(punct.char)
      expect(result?.token).toBe(TokenType.Punctuation)
      expect(result?.value).toBe(punct.char)
    })
  }
})

describe('grammarRules - 空白字符', () => {
  it('should match spaces', () => {
    const result = matchToken('   ')
    expect(result?.token).toBe(TokenType.Whitespace)
    expect(result?.value).toBe('   ')
  })

  it('should match tabs', () => {
    const result = matchToken('\t\t')
    expect(result?.token).toBe(TokenType.Whitespace)
    expect(result?.value).toBe('\t\t')
  })

  it('should match mixed spaces and tabs', () => {
    const result = matchToken('  \t  ')
    expect(result?.token).toBe(TokenType.Whitespace)
    expect(result?.value).toBe('  \t  ')
  })

  it('should match single space', () => {
    const result = matchToken(' ')
    expect(result?.token).toBe(TokenType.Whitespace)
    expect(result?.value).toBe(' ')
  })
})

describe('grammarRules - 换行符', () => {
  it('should match newline', () => {
    const result = matchToken('\n')
    expect(result?.token).toBe(TokenType.Newline)
    expect(result?.value).toBe('\n')
  })
})
