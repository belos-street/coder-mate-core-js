import type { GrammarRulesMap } from './type'

const CSHARP_KEYWORDS_DECLARATION =
  /^(namespace|using|class|interface|struct|enum|record|delegate|event)\b/
const CSHARP_KEYWORDS_MODIFIER =
  /^(public|private|protected|internal|static|sealed|abstract|virtual|override|async|readonly|unsafe|partial|required|volatile|extern|new|ref|out|params)\b/
const CSHARP_KEYWORDS_CONTROL =
  /^(if|else|switch|case|default|for|foreach|while|do|break|continue|return|try|catch|finally|throw|lock|in|is|as|await|yield|from|where|select|group|join|let|orderby|into|when|get|set|init|add|remove|nameof|typeof|sizeof|checked|unchecked)\b/
const CSHARP_BUILTIN_TYPES =
  /^(void|bool|byte|sbyte|short|ushort|int|uint|long|ulong|nint|nuint|float|double|decimal|char|string|object|dynamic|var|Task|ValueTask|DateTime|Guid|List|Dictionary|IEnumerable|IQueryable|Span|Memory|Func|Action|CancellationToken)\b/

/**
 * C# grammar rules (practical edition)
 */
export const GRAMMAR_RULES: GrammarRulesMap = {
  global: [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^\/\/.*/,
      scope: 'comment.line.double-slash.csharp'
    },
    {
      regex: /^\/\*/,
      scope: 'comment.block.csharp',
      pushState: 'comment-block'
    },
    {
      regex:
        /^#\s*(?:if|elif|else|endif|define|undef|region|endregion|pragma|warning|error|line)\b[^\r\n]*/,
      scope: 'meta.preprocessor.csharp'
    },
    {
      regex:
        /^\[[A-Za-z_][A-Za-z0-9_.]*(?:\s*:\s*[A-Za-z_][A-Za-z0-9_.]*)?(?:\s*\([^\)\r\n]*\))?\]/,
      scope: 'meta.attribute.csharp'
    },
    {
      regex: /^\$?"""/,
      scope: 'string.quoted.raw.csharp',
      pushState: 'string-raw'
    },
    {
      regex: /^(?:@"|\$@"|@\$")/,
      scope: 'string.quoted.verbatim.csharp',
      pushState: 'string-verbatim'
    },
    {
      regex: /^\$?"/,
      scope: 'string.quoted.double.csharp',
      pushState: 'string-double'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.csharp',
      pushState: 'string-single'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)+(?=\s*(?:;|\{))/,
      scope: 'entity.name.namespace.csharp'
    },
    {
      regex: CSHARP_KEYWORDS_DECLARATION,
      scope: 'keyword.declaration.csharp'
    },
    {
      regex: CSHARP_KEYWORDS_MODIFIER,
      scope: 'keyword.modifier.csharp'
    },
    {
      regex: CSHARP_KEYWORDS_CONTROL,
      scope: 'keyword.control.csharp'
    },
    {
      regex: CSHARP_BUILTIN_TYPES,
      scope: 'support.type.builtin.csharp'
    },
    {
      regex: /^(true|false)\b/,
      scope: 'constant.language.boolean.csharp'
    },
    {
      regex: /^(null|default)\b/,
      scope: 'constant.language.null.csharp'
    },
    {
      regex: /^(this|base)\b/,
      scope: 'variable.language.csharp'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*(?=\s*\()/,
      scope: 'entity.name.function.csharp'
    },
    {
      regex: /^[A-Z][A-Za-z0-9_]*(?=\s*(?:<|\.|\(|\{|\[|,|;|=|\)|:|$))/,
      scope: 'entity.name.type.csharp'
    },
    {
      regex:
        /^(?:0[xX][0-9A-Fa-f_]+(?:[uUlLfFmMdD]{0,2})?|0[bB][01_]+(?:[uUlL]{0,2})?|(?:\d[\d_]*)(?:\.\d[\d_]*)?(?:[eE][+-]?\d[\d_]*)?(?:[uUlLfFmMdD]{0,2})?)/,
      scope: 'constant.numeric.csharp'
    },
    {
      regex:
        /^(?:=>|\?\?|\?\.|::|==|!=|<=|>=|&&|\|\||<<|>>|\+\+|--|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|[-+*/%=&|^~!?<>:.;,()[\]{}])/,
      scope: 'operator.csharp'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'default'
    }
  ],

  'comment-block': [
    {
      regex: /^[\s\S]*?\*\//,
      scope: 'comment.block.csharp',
      popState: true
    },
    {
      regex: /^[\s\S]+/,
      scope: 'comment.block.csharp'
    }
  ],

  'string-double': [
    {
      regex: /^[^"\\\n]+/,
      scope: 'string.quoted.double.csharp'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.double.csharp'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.csharp',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.double.csharp'
    }
  ],

  'string-single': [
    {
      regex: /^[^'\\\n]+/,
      scope: 'string.quoted.single.csharp'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.single.csharp'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.csharp',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.single.csharp'
    }
  ],

  'string-verbatim': [
    {
      regex: /^[^"]+/,
      scope: 'string.quoted.verbatim.csharp'
    },
    {
      regex: /^""/,
      scope: 'string.quoted.verbatim.csharp'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.verbatim.csharp',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.verbatim.csharp'
    }
  ],

  'string-raw': [
    {
      regex: /^[\s\S]*?"""/,
      scope: 'string.quoted.raw.csharp',
      popState: true
    },
    {
      regex: /^[\s\S]+/,
      scope: 'string.quoted.raw.csharp'
    }
  ]
}
