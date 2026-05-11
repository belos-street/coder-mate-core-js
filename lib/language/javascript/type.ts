﻿/**
 * JavaScript (ES2020) grammar type definitions
 */

import type {
  GrammarRule as CoreGrammarRule,
  GrammarRulesMap as CoreGrammarRulesMap,
  ParserContext as CoreParserContext,
  ScopeStyleMap as CoreScopeStyleMap,
  Token as CoreToken,
  TokenStream as CoreTokenStream
} from '../../core/types'

// ==================== Token scopes ====================

export type TokenScope =
  | 'comment.line.double-slash.js'
  | 'comment.block.js'
  | 'keyword.control.js'
  | 'keyword.control.async.js'
  | 'keyword.control.class.js'
  | 'keyword.control.module.js'
  | 'keyword.control.import.js'
  | 'keyword.declaration.js'
  | 'constant.language.boolean.js'
  | 'constant.language.null.js'
  | 'constant.language.js'
  | 'constant.numeric.js'
  | 'variable.language.global-this.js'
  | 'variable.identifier.js'
  | 'string.quoted.double.js'
  | 'string.quoted.single.js'
  | 'string.quoted.backtick.js'
  | 'operator.js'
  | 'operator.optional-chaining.js'
  | 'operator.nullish-coalescing.js'
  | 'operator.arrow-function.js'
  | 'punctuation.definition.template-expression.js'
  | 'support.function.promise.js'
  | 'default'

// ==================== FSM states ====================

export type GrammarState =
  | 'global'
  | 'multiline-comment'
  | 'string-double'
  | 'string-single'
  | 'string-backtick'
  | 'template-interpolation'
  | 'import-dynamic'

// ==================== Aliases to core generic types ====================

export type Token = CoreToken<TokenScope>

export type GrammarRule = CoreGrammarRule<GrammarState, TokenScope>

export type ParserContext = CoreParserContext<GrammarState>

export type ScopeStyleMap = CoreScopeStyleMap<TokenScope>

export type GrammarRulesMap = CoreGrammarRulesMap<GrammarState, TokenScope>

export type TokenStream = CoreTokenStream<TokenScope>
