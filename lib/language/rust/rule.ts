import type { GrammarRulesMap } from './type'

const RUST_KEYWORDS_DECLARATION =
  /^(fn|let|const|static|struct|enum|trait|impl|type|mod|use|crate|extern)\b/
const RUST_KEYWORDS_MODIFIER =
  /^(pub|mut|unsafe|async|move|ref|dyn|where|in)\b/
const RUST_KEYWORDS_CONTROL =
  /^(if|else|match|for|while|loop|break|continue|return|await|as)\b/
const RUST_BUILTIN_TYPES =
  /^(bool|char|str|String|i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|Option|Result|Vec|Box|HashMap|BTreeMap)\b/

/**
 * Rust grammar rules (practical edition)
 */
export const GRAMMAR_RULES: GrammarRulesMap = {
  global: [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^\/\/.*/,
      scope: 'comment.line.double-slash.rust'
    },
    {
      regex: /^\/\*/,
      scope: 'comment.block.rust',
      pushState: 'comment-block'
    },
    {
      regex: /^#\s*!\[[^\]\r\n]*\]|^#\s*\[[^\]\r\n]*\]/,
      scope: 'meta.attribute.rust'
    },
    {
      regex: /^r#*"/,
      scope: 'string.quoted.raw.rust',
      pushState: 'string-raw'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.rust',
      pushState: 'string-double'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.rust',
      pushState: 'string-single'
    },
    {
      regex: RUST_KEYWORDS_DECLARATION,
      scope: 'keyword.declaration.rust'
    },
    {
      regex: RUST_KEYWORDS_MODIFIER,
      scope: 'keyword.modifier.rust'
    },
    {
      regex: RUST_KEYWORDS_CONTROL,
      scope: 'keyword.control.rust'
    },
    {
      regex: RUST_BUILTIN_TYPES,
      scope: 'support.type.builtin.rust'
    },
    {
      regex: /^(true|false)\b/,
      scope: 'constant.language.boolean.rust'
    },
    {
      regex: /^(None)\b/,
      scope: 'constant.language.null.rust'
    },
    {
      regex: /^(self|Self|super|crate)\b/,
      scope: 'variable.language.rust'
    },
    {
      regex: /^[a-z_][A-Za-z0-9_]*(?=::)/,
      scope: 'entity.name.namespace.rust'
    },
    {
      regex: /^[A-Z][A-Za-z0-9_]*(?=\s*(?:::|<|[,);=]|$))/,
      scope: 'entity.name.type.rust'
    },
    {
      regex: /^[a-z_][A-Za-z0-9_]*(?=!)/,
      scope: 'entity.name.macro.rust'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*(?=\s*(?:::<[^>]+>)?\s*\()/,
      scope: 'entity.name.function.rust'
    },
    {
      regex:
        /^(?:0[xX][0-9A-Fa-f_]+(?:[iu](?:8|16|32|64|128|size))?|0[bB][01_]+(?:[iu](?:8|16|32|64|128|size))?|0[oO][0-7_]+(?:[iu](?:8|16|32|64|128|size))?|(?:\d[\d_]*)(?:\.\d[\d_]*)?(?:[eE][+-]?\d[\d_]*)?(?:[iu](?:8|16|32|64|128|size)|f32|f64)?)/,
      scope: 'constant.numeric.rust'
    },
    {
      regex:
        /^(?:::|->|=>|==|!=|<=|>=|&&|\|\||<<|>>|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|[-+*/%=&|^~!?<>:.;,()[\]{}])/,
      scope: 'operator.rust'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'default'
    }
  ],

  'comment-block': [
    {
      regex: /^[\s\S]*?\*\//,
      scope: 'comment.block.rust',
      popState: true
    },
    {
      regex: /^[\s\S]+/,
      scope: 'comment.block.rust'
    }
  ],

  'string-double': [
    {
      regex: /^[^"\\\n]+/,
      scope: 'string.quoted.double.rust'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.double.rust'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.rust',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.double.rust'
    }
  ],

  'string-single': [
    {
      regex: /^[^'\\\n]+/,
      scope: 'string.quoted.single.rust'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.single.rust'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.rust',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.single.rust'
    }
  ],

  'string-raw': [
    {
      regex: /^[\s\S]*?"#*/,
      scope: 'string.quoted.raw.rust',
      popState: true
    },
    {
      regex: /^[\s\S]+/,
      scope: 'string.quoted.raw.rust'
    }
  ]
}
