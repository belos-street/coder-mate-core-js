import type { GrammarRulesMap } from './type'

const CPP_KEYWORDS_DECLARATION =
  /^(class|struct|union|enum|template|typename|using|namespace|concept)\b/
const CPP_KEYWORDS_MODIFIER =
  /^(static|extern|register|auto|const|volatile|mutable|inline|virtual|explicit|friend|thread_local|constexpr|consteval|constinit|signed|unsigned|short|long|final|override)\b/
const CPP_KEYWORDS_CONTROL =
  /^(if|else|switch|case|default|for|while|do|break|continue|return|try|catch|throw|new|delete|this|sizeof|typeid|noexcept|static_assert|co_await|co_return|co_yield)\b/
const CPP_PREPROCESSOR_INCLUDE = /^#\s*include\b/
const CPP_PREPROCESSOR_DEFINE = /^#\s*define\b/
const CPP_PREPROCESSOR_MACRO_REF = /^#\s*(?:ifdef|ifndef|undef)\b/
const CPP_PREPROCESSOR_OTHER =
  /^#\s*(?:if|elif|else|endif|pragma|error|warning|line)\b/
const CPP_BUILTIN_TYPES =
  /^(void|bool|char|char8_t|char16_t|char32_t|wchar_t|short|int|long|float|double|auto|size_t|ptrdiff_t|string|std::string|int8_t|int16_t|int32_t|int64_t|uint8_t|uint16_t|uint32_t|uint64_t)\b/

/**
 * C++ grammar rules (practical edition)
 */
export const GRAMMAR_RULES: GrammarRulesMap = {
  global: [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^\/\/.*/,
      scope: 'comment.line.double-slash.cpp'
    },
    {
      regex: /^\/\*/,
      scope: 'comment.block.cpp',
      pushState: 'comment-block'
    },
    {
      regex: CPP_PREPROCESSOR_INCLUDE,
      scope: 'keyword.control.directive.cpp',
      pushState: 'preprocessor-include'
    },
    {
      regex: CPP_PREPROCESSOR_DEFINE,
      scope: 'keyword.control.directive.cpp',
      pushState: 'preprocessor-define'
    },
    {
      regex: CPP_PREPROCESSOR_MACRO_REF,
      scope: 'keyword.control.directive.cpp',
      pushState: 'preprocessor-macro-ref'
    },
    {
      regex: CPP_PREPROCESSOR_OTHER,
      scope: 'keyword.control.directive.cpp'
    },
    {
      regex: /^#[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'meta.preprocessor.cpp'
    },
    {
      regex: /^R"[^\s()\\\r\n]{0,16}\(/,
      scope: 'string.quoted.raw.cpp',
      pushState: 'string-raw'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.cpp',
      pushState: 'string-double'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.cpp',
      pushState: 'string-single'
    },
    {
      regex: CPP_KEYWORDS_DECLARATION,
      scope: 'keyword.declaration.cpp'
    },
    {
      regex: CPP_KEYWORDS_MODIFIER,
      scope: 'keyword.modifier.cpp'
    },
    {
      regex: CPP_KEYWORDS_CONTROL,
      scope: 'keyword.control.cpp'
    },
    {
      regex: CPP_BUILTIN_TYPES,
      scope: 'support.type.builtin.cpp'
    },
    {
      regex: /^(true|false)\b/,
      scope: 'constant.language.boolean.cpp'
    },
    {
      regex: /^(nullptr|NULL)\b/,
      scope: 'constant.language.null.cpp'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*(?=::)/,
      scope: 'entity.name.namespace.cpp'
    },
    {
      regex: /^(?:__[A-Z_][A-Z0-9_]*__|[A-Z][A-Z0-9_]*|[A-Z_][A-Z0-9_]{2,})(?=\b)/,
      scope: 'entity.name.macro.cpp'
    },
    {
      regex: /^[A-Z][A-Za-z0-9_]*(?=\s*(?:<|::|[&*]|,|\)|\{|;|=))/,
      scope: 'entity.name.type.cpp'
    },
    {
      regex: /^[A-Za-z_~][A-Za-z0-9_~]*(?=\s*\()/,
      scope: 'entity.name.function.cpp'
    },
    {
      regex:
        /^(?:0[xX][0-9A-Fa-f']+(?:[uUlLfFzZ]{0,4})?|0[bB][01']+(?:[uUlL]{0,3})?|(?:\d[\d']*)(?:\.(?:\d[\d']*)?)?(?:[eEpP][+-]?\d[\d']*)?[fFlLuUzZ]{0,4})/,
      scope: 'constant.numeric.cpp'
    },
    {
      regex:
        /^(?:::|->\*|->|\.\*|\.\.\.|<=>|==|!=|<=|>=|<<=|>>=|\+\+|--|&&|\|\||<<|>>|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|[-+*/%=&|^~!?<>:.;,()[\]{}])/,
      scope: 'operator.cpp'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'default'
    }
  ],

  'preprocessor-include': [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^<[^>\r\n]+>/,
      scope: 'string.quoted.angle.cpp',
      popState: true
    },
    {
      regex: /^"[^"\r\n]*"/,
      scope: 'string.quoted.double.cpp',
      popState: true
    },
    {
      regex: /^./,
      scope: 'default',
      popState: true
    }
  ],

  'preprocessor-define': [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'entity.name.macro.cpp',
      popState: true
    },
    {
      regex: /^./,
      scope: 'default',
      popState: true
    }
  ],

  'preprocessor-macro-ref': [
    {
      regex: /^\s+/,
      scope: 'default'
    },
    {
      regex: /^[A-Za-z_][A-Za-z0-9_]*/,
      scope: 'entity.name.macro.cpp',
      popState: true
    },
    {
      regex: /^./,
      scope: 'default',
      popState: true
    }
  ],

  'comment-block': [
    {
      regex: /^[\s\S]*?\*\//,
      scope: 'comment.block.cpp',
      popState: true
    },
    {
      regex: /^[\s\S]+/,
      scope: 'comment.block.cpp'
    }
  ],

  'string-double': [
    {
      regex: /^[^"\\\n]+/,
      scope: 'string.quoted.double.cpp'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.double.cpp'
    },
    {
      regex: /^"/,
      scope: 'string.quoted.double.cpp',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.double.cpp'
    }
  ],

  'string-single': [
    {
      regex: /^[^'\\\n]+/,
      scope: 'string.quoted.single.cpp'
    },
    {
      regex: /^\\./,
      scope: 'string.quoted.single.cpp'
    },
    {
      regex: /^'/,
      scope: 'string.quoted.single.cpp',
      popState: true
    },
    {
      regex: /^./,
      scope: 'string.quoted.single.cpp'
    }
  ],

  'string-raw': [
    {
      regex: /^[\s\S]*?\)[^"\r\n\\]{0,16}"/,
      scope: 'string.quoted.raw.cpp',
      popState: true
    },
    {
      regex: /^[\s\S]+/,
      scope: 'string.quoted.raw.cpp'
    }
  ]
}
