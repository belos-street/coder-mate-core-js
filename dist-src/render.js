// lib/core/tokenizer.ts
var createInitialContext = (initialState) => ({
  stateStack: [initialState],
  line: 1,
  col: 1
});
var pushState = (context, state) => ({
  ...context,
  stateStack: [...context.stateStack, state]
});
var popState = (context) => {
  if (context.stateStack.length <= 1) {
    throw new Error("Cannot pop the last state from stack");
  }
  return {
    ...context,
    stateStack: context.stateStack.slice(0, -1)
  };
};
var getCurrentState = (context) => context.stateStack[context.stateStack.length - 1];
var splitTokenByLineBreak = (text, tokenScope, lineBreakScope, startLine, startCol) => {
  const tokens = [];
  let remaining = text;
  let currentLine = startLine;
  let currentCol = startCol;
  while (remaining.length > 0) {
    const lineBreakIndex = remaining.indexOf(`
`);
    if (lineBreakIndex === -1) {
      tokens.push({
        text: remaining,
        scope: tokenScope,
        line: currentLine,
        col: [currentCol, currentCol + remaining.length - 1]
      });
      break;
    }
    const isCRLF = lineBreakIndex > 0 && remaining[lineBreakIndex - 1] === "\r";
    const lineBreakChar = isCRLF ? remaining.slice(lineBreakIndex - 1, lineBreakIndex + 1) : remaining.slice(lineBreakIndex, lineBreakIndex + 1);
    const beforeLineBreak = isCRLF ? remaining.slice(0, lineBreakIndex - 1) : remaining.slice(0, lineBreakIndex);
    if (beforeLineBreak) {
      const beforeToken = {
        text: beforeLineBreak,
        scope: tokenScope,
        line: currentLine,
        col: [currentCol, currentCol + beforeLineBreak.length - 1]
      };
      tokens.push(beforeToken);
      currentCol = beforeToken.col[1] + 1;
    }
    tokens.push({
      text: lineBreakChar,
      scope: lineBreakScope,
      line: currentLine,
      col: [currentCol, currentCol + lineBreakChar.length - 1]
    });
    currentLine += 1;
    currentCol = 1;
    const sliceStart = isCRLF ? lineBreakIndex - 1 : lineBreakIndex;
    remaining = remaining.slice(sliceStart + lineBreakChar.length);
  }
  return tokens;
};
var matchToken = (code, context, spec) => {
  const currentState = getCurrentState(context);
  const rules = spec.rules[currentState];
  for (const rule of rules) {
    const match = rule.regex.exec(code);
    if (!match)
      continue;
    const matchedText = match[0];
    const token = {
      text: matchedText,
      scope: rule.scope,
      line: context.line,
      col: [context.col, context.col + matchedText.length - 1]
    };
    let newContext = { ...context };
    if (rule.pushState) {
      newContext = pushState(newContext, rule.pushState);
    }
    if (rule.popState) {
      newContext = popState(newContext);
    }
    newContext.col = token.col[1] + 1;
    return { token, newContext };
  }
  if (code.length > 0) {
    const char = code[0];
    const token = {
      text: char,
      scope: spec.fallbackScope,
      line: context.line,
      col: [context.col, context.col]
    };
    return { token, newContext: { ...context, col: context.col + 1 } };
  }
  return null;
};
var parse = (code, spec) => {
  const rows = [];
  let currentRowTokens = [];
  let remainingCode = code;
  let context = createInitialContext(spec.initialState);
  const lineBreakRegex = /^\r?\n/;
  while (remainingCode.length > 0) {
    const lineBreakMatch = lineBreakRegex.exec(remainingCode);
    if (lineBreakMatch) {
      const lineBreakText = lineBreakMatch[0];
      currentRowTokens.push({
        text: lineBreakText,
        scope: spec.fallbackScope,
        line: context.line,
        col: [context.col, context.col + lineBreakText.length - 1]
      });
      rows.push(currentRowTokens);
      currentRowTokens = [];
      context = {
        ...context,
        line: context.line + 1,
        col: 1
      };
      remainingCode = remainingCode.slice(lineBreakText.length);
      continue;
    }
    const result = matchToken(remainingCode, context, spec);
    if (!result) {
      remainingCode = remainingCode.slice(1);
      context = {
        ...context,
        col: context.col + 1
      };
      continue;
    }
    const { token, newContext } = result;
    if (token.text.includes(`
`)) {
      const splitTokens = splitTokenByLineBreak(token.text, token.scope, spec.fallbackScope, token.line, token.col[0]);
      for (const splitToken of splitTokens) {
        if (splitToken.text.includes(`
`)) {
          currentRowTokens.push(splitToken);
          rows.push(currentRowTokens);
          currentRowTokens = [];
          context = {
            ...context,
            stateStack: newContext.stateStack,
            line: splitToken.line + 1,
            col: 1
          };
        } else {
          currentRowTokens.push(splitToken);
          context = {
            ...context,
            stateStack: newContext.stateStack,
            line: splitToken.line,
            col: splitToken.col[1] + 1
          };
        }
      }
    } else {
      currentRowTokens.push(token);
      context = {
        ...newContext,
        col: token.col[1] + 1
      };
    }
    remainingCode = remainingCode.slice(token.text.length);
  }
  if (currentRowTokens.length > 0) {
    rows.push(currentRowTokens);
  }
  return rows;
};

// lib/language/javascript/rule.ts
var GRAMMAR_RULES = {
  global: [
    {
      regex: /^\/\/.*/,
      scope: "comment.line.double-slash.js"
    },
    {
      regex: /^\/\*/,
      scope: "comment.block.js",
      pushState: "multiline-comment"
    },
    {
      regex: /^(import)\s*\(/,
      scope: "keyword.control.import.js",
      pushState: "import-dynamic"
    },
    {
      regex: /^(export)\s*\*\s*as\s*(\w+)\s*from/,
      scope: "keyword.control.module.js"
    },
    {
      regex: /^(import|export)\b/,
      scope: "keyword.control.module.js"
    },
    {
      regex: /^(globalThis)\b/,
      scope: "variable.language.global-this.js"
    },
    {
      regex: /^(Promise\.allSettled)\b/,
      scope: "support.function.promise.js"
    },
    {
      regex: /^(if|else|for|while|do|switch|case|break|continue|return|throw|try|catch|finally)\b/,
      scope: "keyword.control.js"
    },
    {
      regex: /^(async|await)\b/,
      scope: "keyword.control.async.js"
    },
    {
      regex: /^(class|extends|static|constructor)\b/,
      scope: "keyword.control.class.js"
    },
    {
      regex: /^(function|var|let|const)\b/,
      scope: "keyword.declaration.js"
    },
    {
      regex: /^(true|false)\b/,
      scope: "constant.language.boolean.js"
    },
    {
      regex: /^(null|undefined)\b/,
      scope: "constant.language.null.js"
    },
    {
      regex: /^(\?\.)/,
      scope: "operator.optional-chaining.js"
    },
    {
      regex: /^(\?\?)/,
      scope: "operator.nullish-coalescing.js"
    },
    {
      regex: /^=>/,
      scope: "operator.arrow-function.js"
    },
    {
      regex: /^(===|!==|==|!=|>=|<=|&&|\|\||\+\+|--|\+|-|\*|\/|%|=|>|<|!|\.|,|:|;|\(|\)|\{|\}|\[|\])/,
      scope: "operator.js"
    },
    {
      regex: /^(0b[01]+n?|0o[0-7]+n?|0x[0-9a-fA-F]+n?|\d+\.?\d*e?\d*n?|\.\d+e?\d*n?)/,
      scope: "constant.numeric.js"
    },
    {
      regex: /^`/,
      scope: "string.quoted.backtick.js",
      pushState: "string-backtick"
    },
    {
      regex: /^"/,
      scope: "string.quoted.double.js",
      pushState: "string-double"
    },
    {
      regex: /^'/,
      scope: "string.quoted.single.js",
      pushState: "string-single"
    },
    {
      regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/,
      scope: "variable.identifier.js"
    }
  ],
  "multiline-comment": [
    {
      regex: /^[\s\S]*?\*\//,
      scope: "comment.block.js",
      popState: true
    },
    {
      regex: /^[\s\S]*/,
      scope: "comment.block.js"
    }
  ],
  "string-double": [
    {
      regex: /^[^\\"]*(?:\\.[^\\"]*)*"/,
      scope: "string.quoted.double.js",
      popState: true
    },
    {
      regex: /^.*/,
      scope: "string.quoted.double.js"
    }
  ],
  "string-single": [
    {
      regex: /^[^\\']*(?:\\.[^\\']*)*'/,
      scope: "string.quoted.single.js",
      popState: true
    },
    {
      regex: /^.*/,
      scope: "string.quoted.single.js"
    }
  ],
  "string-backtick": [
    {
      regex: /^\$\{/,
      scope: "punctuation.definition.template-expression.js",
      pushState: "template-interpolation"
    },
    {
      regex: /^[^\\`\$]+/,
      scope: "string.quoted.backtick.js"
    },
    {
      regex: /^\\./,
      scope: "string.quoted.backtick.js"
    },
    {
      regex: /^\$/,
      scope: "string.quoted.backtick.js"
    },
    {
      regex: /^`/,
      scope: "string.quoted.backtick.js",
      popState: true
    }
  ],
  "template-interpolation": [
    {
      regex: /^}/,
      scope: "punctuation.definition.template-expression.js",
      popState: true
    },
    {
      regex: /^(if|else|const|let|var|async|await)\b/,
      scope: "keyword.control.js"
    },
    {
      regex: /^(true|false|null|undefined)\b/,
      scope: "constant.language.js"
    },
    {
      regex: /^(\?\.)|(\?\?)/,
      scope: "operator.js"
    },
    {
      regex: /^"/,
      scope: "string.quoted.double.js",
      pushState: "string-double"
    },
    {
      regex: /^'/,
      scope: "string.quoted.single.js",
      pushState: "string-single"
    },
    {
      regex: /^\d+n?/,
      scope: "constant.numeric.js"
    },
    {
      regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/,
      scope: "variable.identifier.js"
    },
    {
      regex: /^[+\-*/=<>!&|.,;:()[\]]/,
      scope: "operator.js"
    },
    {
      regex: /^\{/,
      scope: "operator.js"
    },
    {
      regex: /^./,
      scope: "variable.identifier.js"
    }
  ],
  "import-dynamic": [
    {
      regex: /^\)/,
      scope: "operator.js",
      popState: true
    },
    {
      regex: /^"/,
      scope: "string.quoted.double.js",
      pushState: "string-double"
    },
    {
      regex: /^'/,
      scope: "string.quoted.single.js",
      pushState: "string-single"
    },
    {
      regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/,
      scope: "variable.identifier.js"
    },
    {
      regex: /^[+\-*/=<>!&|.,;:()[\]{}]/,
      scope: "operator.js"
    },
    {
      regex: /^./,
      scope: "variable.identifier.js"
    }
  ]
};

// lib/language/javascript/spec.ts
var JAVASCRIPT_LANGUAGE_META = {
  id: "javascript",
  aliases: ["js"]
};
var JAVASCRIPT_TOKENIZER_SPEC = {
  initialState: "global",
  rules: GRAMMAR_RULES,
  fallbackScope: "default"
};

// lib/language/javascript/engine.ts
var parse2 = (code) => parse(code, JAVASCRIPT_TOKENIZER_SPEC);

// lib/language/javascript/index.ts
var javascriptLanguage = {
  id: JAVASCRIPT_LANGUAGE_META.id,
  aliases: [...JAVASCRIPT_LANGUAGE_META.aliases],
  parse: parse2
};

// lib/themes/dark-plus.ts
var darkPlusTheme = {
  id: "dark-plus",
  displayName: "Dark+",
  defaultStyle: "color: #D4D4D4;",
  preStyle: "background: #1E1E1E; padding: 16px; border-radius: 8px; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.5; white-space: pre;",
  styles: {
    "comment.line.double-slash.js": "color: #6A9955;",
    "comment.block.js": "color: #6A9955; font-style: italic;",
    "comment.line.number-sign.python": "color: #6A9955;",
    "keyword.control.js": "color: #569CD6;",
    "keyword.control.async.js": "color: #C586C0;",
    "keyword.control.class.js": "color: #569CD6; font-weight: bold;",
    "keyword.control.module.js": "color: #569CD6;",
    "keyword.control.import.js": "color: #569CD6;",
    "keyword.declaration.js": "color: #569CD6;",
    "keyword.control.python": "color: #569CD6;",
    "keyword.declaration.python": "color: #569CD6; font-weight: bold;",
    "entity.name.function.python": "color: #DCDCAA;",
    "entity.name.class.python": "color: #4EC9B0;",
    "support.function.builtin.python": "color: #DCDCAA; font-weight: bold;",
    "support.type.annotation.python": "color: #4EC9B0;",
    "meta.decorator.python": "color: #C586C0;",
    "constant.language.boolean.js": "color: #569CD6;",
    "constant.language.null.js": "color: #569CD6;",
    "constant.language.js": "color: #569CD6;",
    "constant.numeric.js": "color: #B5CEA8;",
    "constant.language.boolean.json": "color: #569CD6;",
    "constant.language.null.json": "color: #569CD6;",
    "constant.numeric.json": "color: #B5CEA8;",
    "constant.language.boolean.python": "color: #569CD6;",
    "constant.language.none.python": "color: #569CD6;",
    "constant.numeric.python": "color: #B5CEA8;",
    "variable.language.global-this.js": "color: #C586C0; font-weight: bold;",
    "string.quoted.double.js": "color: #CE9178;",
    "string.quoted.single.js": "color: #CE9178;",
    "string.quoted.backtick.js": "color: #CE9178;",
    "string.quoted.double.json": "color: #CE9178;",
    "string.quoted.double.python": "color: #CE9178;",
    "string.quoted.single.python": "color: #CE9178;",
    "string.quoted.double.triple.python": "color: #CE9178;",
    "string.quoted.single.triple.python": "color: #CE9178;",
    "string.interpolated.python": "color: #CE9178;",
    "operator.js": "color: #D4D4D4;",
    "operator.optional-chaining.js": "color: #DCDCAA; font-weight: bold;",
    "operator.nullish-coalescing.js": "color: #DCDCAA; font-weight: bold;",
    "operator.arrow-function.js": "color: #DCDCAA;",
    "operator.python": "color: #D4D4D4;",
    "punctuation.definition.template-expression.js": "color: #C586C0;",
    "punctuation.separator.key-value.json": "color: #D4D4D4;",
    "punctuation.separator.value.json": "color: #D4D4D4;",
    "meta.structure.dictionary.json": "color: #D4D4D4;",
    "meta.structure.array.json": "color: #D4D4D4;",
    "punctuation.definition.interpolation.begin.python": "color: #C586C0;",
    "punctuation.definition.interpolation.end.python": "color: #C586C0;",
    "punctuation.format.fstring.python": "color: #D7BA7D;",
    "variable.identifier.js": "color: #9CDCFE;",
    "variable.alias.python": "color: #9CDCFE; font-style: italic;",
    "variable.comprehension.python": "color: #9CDCFE;",
    "variable.identifier.python": "color: #9CDCFE;",
    "support.function.promise.js": "color: #DCDCAA; font-weight: bold;",
    default: "color: #D4D4D4;"
  }
};

// lib/themes/github-light.ts
var githubLightTheme = {
  id: "github-light",
  displayName: "GitHub Light",
  defaultStyle: "color: #24292F;",
  preStyle: "background: #FFFFFF; color: #24292F; border: 1px solid #D0D7DE; padding: 16px; border-radius: 8px; font-family: 'SFMono-Regular', 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.5; white-space: pre;",
  styles: {
    "comment.line.double-slash.js": "color: #6A737D; font-style: italic;",
    "comment.block.js": "color: #6A737D; font-style: italic;",
    "comment.line.number-sign.python": "color: #6A737D; font-style: italic;",
    "keyword.control.js": "color: #D73A49;",
    "keyword.control.async.js": "color: #6F42C1;",
    "keyword.control.class.js": "color: #D73A49; font-weight: bold;",
    "keyword.control.module.js": "color: #D73A49;",
    "keyword.control.import.js": "color: #D73A49;",
    "keyword.declaration.js": "color: #D73A49;",
    "keyword.control.python": "color: #D73A49;",
    "keyword.declaration.python": "color: #D73A49; font-weight: bold;",
    "entity.name.function.python": "color: #6F42C1;",
    "entity.name.class.python": "color: #005CC5;",
    "support.function.builtin.python": "color: #6F42C1; font-weight: bold;",
    "support.type.annotation.python": "color: #005CC5;",
    "meta.decorator.python": "color: #6F42C1;",
    "constant.language.boolean.js": "color: #005CC5;",
    "constant.language.null.js": "color: #005CC5;",
    "constant.language.js": "color: #005CC5;",
    "constant.numeric.js": "color: #005CC5;",
    "constant.language.boolean.json": "color: #005CC5;",
    "constant.language.null.json": "color: #005CC5;",
    "constant.numeric.json": "color: #005CC5;",
    "constant.language.boolean.python": "color: #005CC5;",
    "constant.language.none.python": "color: #005CC5;",
    "constant.numeric.python": "color: #005CC5;",
    "variable.language.global-this.js": "color: #6F42C1; font-weight: bold;",
    "string.quoted.double.js": "color: #032F62;",
    "string.quoted.single.js": "color: #032F62;",
    "string.quoted.backtick.js": "color: #032F62;",
    "string.quoted.double.json": "color: #032F62;",
    "string.quoted.double.python": "color: #032F62;",
    "string.quoted.single.python": "color: #032F62;",
    "string.quoted.double.triple.python": "color: #032F62;",
    "string.quoted.single.triple.python": "color: #032F62;",
    "string.interpolated.python": "color: #032F62;",
    "operator.js": "color: #24292F;",
    "operator.optional-chaining.js": "color: #B08800; font-weight: bold;",
    "operator.nullish-coalescing.js": "color: #B08800; font-weight: bold;",
    "operator.arrow-function.js": "color: #B08800;",
    "operator.python": "color: #24292F;",
    "punctuation.definition.template-expression.js": "color: #6F42C1;",
    "punctuation.separator.key-value.json": "color: #24292F;",
    "punctuation.separator.value.json": "color: #24292F;",
    "meta.structure.dictionary.json": "color: #24292F;",
    "meta.structure.array.json": "color: #24292F;",
    "punctuation.definition.interpolation.begin.python": "color: #6F42C1;",
    "punctuation.definition.interpolation.end.python": "color: #6F42C1;",
    "punctuation.format.fstring.python": "color: #B08800;",
    "variable.identifier.js": "color: #24292F;",
    "variable.alias.python": "color: #005CC5; font-style: italic;",
    "variable.comprehension.python": "color: #24292F;",
    "variable.identifier.python": "color: #24292F;",
    "support.function.promise.js": "color: #6F42C1; font-weight: bold;",
    default: "color: #24292F;"
  }
};

// lib/themes/index.ts
var DEFAULT_THEME_ID = darkPlusTheme.id;
var themeRegistry = new Map;
var normalizeThemeId = (themeId) => themeId.trim().toLowerCase();
var registerTheme = (theme) => {
  const normalizedId = normalizeThemeId(theme.id);
  if (!normalizedId) {
    throw new Error("Theme id cannot be empty");
  }
  const existing = themeRegistry.get(normalizedId);
  if (existing && existing !== theme) {
    throw new Error(`Theme "${theme.id}" is already registered`);
  }
  themeRegistry.set(normalizedId, theme);
};
var getTheme = (themeId = DEFAULT_THEME_ID) => {
  const normalizedId = normalizeThemeId(themeId);
  if (!normalizedId) {
    throw new Error("Theme id cannot be empty");
  }
  const theme = themeRegistry.get(normalizedId);
  if (!theme) {
    throw new Error(`Theme "${themeId}" is not registered`);
  }
  return theme;
};
var resolveScopeStyle = (scope, theme) => {
  const exact = theme.styles[scope];
  if (exact)
    return exact;
  let candidate = scope;
  while (candidate.includes(".")) {
    const index = candidate.lastIndexOf(".");
    candidate = candidate.slice(0, index);
    const fallback = theme.styles[candidate];
    if (fallback)
      return fallback;
  }
  return theme.styles.default ?? theme.defaultStyle;
};
var resolveTheme = (theme) => {
  if (!theme)
    return getTheme();
  if (typeof theme === "string")
    return getTheme(theme);
  return theme;
};
registerTheme(darkPlusTheme);
registerTheme(githubLightTheme);

// src/render.ts
var DEFAULT_PRE_STYLE = "background: #1E1E1E; padding: 16px; border-radius: 8px; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.5; white-space: pre;";
var escapeHtml = (text) => {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, "&#96;").replace(/\$/g, "&#36;").replace(/\t/g, "&#9;");
};
var renderHtml = (rows, options) => {
  const theme = resolveTheme(options?.theme);
  const preStyle = options?.preStyle ?? theme.preStyle ?? DEFAULT_PRE_STYLE;
  const lineClassPrefix = options?.lineClassPrefix ?? "line-";
  const rowsHtml = rows.map((rowTokens, rowIndex) => {
    const lineTokensHtml = rowTokens.map((token) => {
      const style = resolveScopeStyle(token.scope, theme);
      return `<span style="${style}">${escapeHtml(token.text)}</span>`;
    }).join("");
    return `<div class="code-line ${lineClassPrefix}${rowIndex + 1}">${lineTokensHtml}</div>`;
  }).join("");
  return `<pre style="${preStyle}"><code>${rowsHtml}</code></pre>`;
};
var highlightJavaScript = (code, options) => {
  const rows = parse2(code);
  return renderHtml(rows, options);
};
export {
  renderHtml,
  highlightJavaScript,
  escapeHtml
};
