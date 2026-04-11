export const LANGUAGE_ORDER = [
  'javascript',
  'typescript',
  'css',
  'bash',
  'sql',
  'yaml',
  'markdown',
  'java',
  'c',
  'cpp',
  'go',
  'rust',
  'csharp',
  'php',
  'html',
  'json',
  'python'
] as const

export type LanguageId = (typeof LANGUAGE_ORDER)[number]

export interface DemoState {
  themeId: string
  languageId: LanguageId
  code: string
}
