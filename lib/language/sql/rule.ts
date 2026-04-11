import type { GrammarRulesMap } from './type'

const SQL_KEYWORDS =
  /^(select|from|where|group|by|order|having|limit|offset|insert|into|values|update|set|delete|join|left|right|full|outer|inner|on|as|distinct|union|all|create|alter|drop|table|view|index|truncate|case|when|then|else|end|with|returning|primary|key|foreign|references|constraint|and|or|not|in|like|between|exists|is|asc|desc)\b/i

const SQL_FUNCTIONS =
  /^(count|sum|avg|min|max|coalesce|concat|substring|length|lower|upper|now|current_date|current_timestamp|date_trunc|round|cast|json_extract|jsonb_extract_path_text)\b/i

const SQL_OPERATORS =
  /^(<>|!=|<=|>=|==|:=|::|->>|->|&&|\|\||[-+*/%<>=])/i

const SQL_TABLE_START =
  /^(from|join|into|update|table|truncate)\b/i

const SQL_TABLE_NAME =
  /^(?:"[^"\r\n]+"|`[^`\r\n]+`|[A-Za-z_][A-Za-z0-9_$]*)(?:\.(?:"[^"\r\n]+"|`[^`\r\n]+`|[A-Za-z_][A-Za-z0-9_$]*))*/

/**
 * SQL grammar rules (practical edition)
 */
export const GRAMMAR_RULES: GrammarRulesMap = {
  global: [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^--[^\r\n]*/,
      scope: 'comment.line.double-dash.sql'
    },
    {
      regex: /^\/\*/,
      scope: 'comment.block.sql',
      pushState: 'comment-block'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.sql',
      pushState: 'string-single'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.sql',
      pushState: 'string-double'
    },
    {
      regex: SQL_TABLE_START,
      scope: 'keyword.control.sql',
      pushState: 'expect-table-name'
    },
    {
      regex: SQL_KEYWORDS,
      scope: 'keyword.control.sql'
    },
    {
      regex: SQL_FUNCTIONS,
      scope: 'support.function.builtin.sql'
    },
    {
      regex: /^(true|false)\b/i,
      scope: 'constant.language.boolean.sql'
    },
    {
      regex: /^null\b/i,
      scope: 'constant.language.null.sql'
    },
    {
      regex: /^(?:\?[0-9]*|:[A-Za-z_][A-Za-z0-9_]*|@[A-Za-z_][A-Za-z0-9_]*|\$[0-9]+)/,
      scope: 'variable.parameter.sql'
    },
    {
      regex: /^-?(?:0|[1-9]\d*)(?:\.\d+)?/,
      scope: 'constant.numeric.sql'
    },
    {
      regex: /^,/,
      scope: 'punctuation.separator.comma.sql'
    },
    {
      regex: /^;/,
      scope: 'punctuation.terminator.statement.sql'
    },
    {
      regex: /^\(/,
      scope: 'punctuation.section.group.begin.sql'
    },
    {
      regex: /^\)/,
      scope: 'punctuation.section.group.end.sql'
    },
    {
      regex: SQL_OPERATORS,
      scope: 'keyword.operator.sql'
    },
    {
      regex: /^`[^`\r\n]+`/,
      scope: 'entity.name.column.sql'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_$]*/,
      scope: 'entity.name.column.sql'
    }
  ],

  'expect-table-name': [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: SQL_TABLE_NAME,
      scope: 'entity.name.table.sql',
      popState: true
    },
    {
      regex: /^./,
      scope: 'default',
      popState: true
    }
  ],

  'string-single': [
    {
      regex: /^[^'\\]*(?:\\.[^'\\]*)*'/,
      scope: 'string.quoted.single.sql',
      popState: true
    },
    {
      regex: /^.*/,
      scope: 'string.quoted.single.sql'
    }
  ],

  'string-double': [
    {
      regex: /^[^"\\]*(?:\\.[^"\\]*)*"/,
      scope: 'string.quoted.double.sql',
      popState: true
    },
    {
      regex: /^.*/,
      scope: 'string.quoted.double.sql'
    }
  ],

  'comment-block': [
    {
      regex: /^[\s\S]*?\*\//,
      scope: 'comment.block.sql',
      popState: true
    },
    {
      regex: /^[\s\S]+/,
      scope: 'comment.block.sql'
    }
  ]
}
