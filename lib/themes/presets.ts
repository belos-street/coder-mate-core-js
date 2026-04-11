import { darkPlusTheme } from './dark-plus/index'
import { createThemeVariant } from './theme-variant'
import type { HighlightTheme } from './types'

interface VariantPalette {
  foreground: string
  comment: string
  keyword: string
  accent: string
  typeName: string
  callable: string
  warning: string
  number: string
  symbol: string
  variable: string
  string: string
  muted: string
}

interface VariantDefinition {
  id: string
  displayName: string
  palette: VariantPalette
  background: string
  border?: string
  fontFamily?: string
}

const DEFAULT_FONT_FAMILY = "'Consolas', 'Monaco', monospace"

const buildPreStyle = (
  background: string,
  foreground: string,
  border?: string,
  fontFamily: string = DEFAULT_FONT_FAMILY
): string => {
  const borderStyle = border ? `border: 1px solid ${border}; ` : ''

  return `background: ${background}; color: ${foreground}; ${borderStyle}padding: 16px; border-radius: 8px; font-family: ${fontFamily}; font-size: 14px; line-height: 1.5; white-space: pre;`
}

const mapFromDarkPlusPalette = (
  palette: VariantPalette
): Record<string, string> => {
  return {
    '#D4D4D4': palette.foreground,
    '#6A9955': palette.comment,
    '#569CD6': palette.keyword,
    '#C586C0': palette.accent,
    '#4EC9B0': palette.typeName,
    '#DCDCAA': palette.callable,
    '#D16969': palette.warning,
    '#B5CEA8': palette.number,
    '#D7BA7D': palette.symbol,
    '#9CDCFE': palette.variable,
    '#CE9178': palette.string,
    '#808080': palette.muted
  }
}

const createPresetTheme = (definition: VariantDefinition): HighlightTheme => {
  const colorMap = mapFromDarkPlusPalette(definition.palette)

  return createThemeVariant(darkPlusTheme, {
    id: definition.id,
    displayName: definition.displayName,
    defaultStyle: `color: ${definition.palette.foreground};`,
    preStyle: buildPreStyle(
      definition.background,
      definition.palette.foreground,
      definition.border,
      definition.fontFamily
    ),
    colorMap
  })
}

const PRESET_DEFINITIONS: VariantDefinition[] = [
  {
    id: 'github-light',
    displayName: 'GitHub Light',
    background: '#FFFFFF',
    border: '#D0D7DE',
    fontFamily: "'SFMono-Regular', 'Consolas', 'Monaco', monospace",
    palette: {
      foreground: '#24292F',
      comment: '#6A737D',
      keyword: '#D73A49',
      accent: '#6F42C1',
      typeName: '#005CC5',
      callable: '#6F42C1',
      warning: '#D73A49',
      number: '#005CC5',
      symbol: '#B08800',
      variable: '#24292F',
      string: '#032F62',
      muted: '#24292F'
    }
  },
  {
    id: 'dracula',
    displayName: 'Dracula',
    background: '#282A36',
    palette: {
      foreground: '#F8F8F2',
      comment: '#6272A4',
      keyword: '#FF79C6',
      accent: '#BD93F9',
      typeName: '#8BE9FD',
      callable: '#F1FA8C',
      warning: '#FF5555',
      number: '#50FA7B',
      symbol: '#FFB86C',
      variable: '#8BE9FD',
      string: '#F1FA8C',
      muted: '#6272A4'
    }
  },
  {
    id: 'one-dark-pro',
    displayName: 'One Dark Pro',
    background: '#282C34',
    palette: {
      foreground: '#ABB2BF',
      comment: '#5C6370',
      keyword: '#C678DD',
      accent: '#C678DD',
      typeName: '#56B6C2',
      callable: '#E5C07B',
      warning: '#E06C75',
      number: '#98C379',
      symbol: '#D19A66',
      variable: '#61AFEF',
      string: '#98C379',
      muted: '#7F848E'
    }
  },
  {
    id: 'nord',
    displayName: 'Nord',
    background: '#2E3440',
    palette: {
      foreground: '#D8DEE9',
      comment: '#616E88',
      keyword: '#81A1C1',
      accent: '#B48EAD',
      typeName: '#88C0D0',
      callable: '#EBCB8B',
      warning: '#BF616A',
      number: '#A3BE8C',
      symbol: '#D08770',
      variable: '#8FBCBB',
      string: '#A3BE8C',
      muted: '#4C566A'
    }
  },
  {
    id: 'monokai',
    displayName: 'Monokai',
    background: '#272822',
    palette: {
      foreground: '#F8F8F2',
      comment: '#75715E',
      keyword: '#F92672',
      accent: '#AE81FF',
      typeName: '#66D9EF',
      callable: '#E6DB74',
      warning: '#F92672',
      number: '#AE81FF',
      symbol: '#FD971F',
      variable: '#A6E22E',
      string: '#E6DB74',
      muted: '#75715E'
    }
  },
  {
    id: 'material-ocean',
    displayName: 'Material Ocean',
    background: '#0F111A',
    palette: {
      foreground: '#A6ACCD',
      comment: '#546E7A',
      keyword: '#C792EA',
      accent: '#C792EA',
      typeName: '#89DDFF',
      callable: '#FFCB6B',
      warning: '#F07178',
      number: '#C3E88D',
      symbol: '#F78C6C',
      variable: '#82AAFF',
      string: '#C3E88D',
      muted: '#717CB4'
    }
  },
  {
    id: 'tokyo-night',
    displayName: 'Tokyo Night',
    background: '#1A1B26',
    palette: {
      foreground: '#C0CAF5',
      comment: '#565F89',
      keyword: '#7AA2F7',
      accent: '#BB9AF7',
      typeName: '#7DCFFF',
      callable: '#E0AF68',
      warning: '#F7768E',
      number: '#9ECE6A',
      symbol: '#FF9E64',
      variable: '#73DACA',
      string: '#9ECE6A',
      muted: '#414868'
    }
  },
  {
    id: 'solarized-dark',
    displayName: 'Solarized Dark',
    background: '#002B36',
    palette: {
      foreground: '#93A1A1',
      comment: '#586E75',
      keyword: '#268BD2',
      accent: '#6C71C4',
      typeName: '#2AA198',
      callable: '#B58900',
      warning: '#DC322F',
      number: '#859900',
      symbol: '#CB4B16',
      variable: '#268BD2',
      string: '#859900',
      muted: '#657B83'
    }
  },
  {
    id: 'solarized-light',
    displayName: 'Solarized Light',
    background: '#FDF6E3',
    border: '#EEE8D5',
    palette: {
      foreground: '#657B83',
      comment: '#93A1A1',
      keyword: '#268BD2',
      accent: '#6C71C4',
      typeName: '#2AA198',
      callable: '#B58900',
      warning: '#DC322F',
      number: '#859900',
      symbol: '#CB4B16',
      variable: '#268BD2',
      string: '#859900',
      muted: '#93A1A1'
    }
  }
]

export const githubLightTheme = createPresetTheme(PRESET_DEFINITIONS[0]!)
export const draculaTheme = createPresetTheme(PRESET_DEFINITIONS[1]!)
export const oneDarkProTheme = createPresetTheme(PRESET_DEFINITIONS[2]!)
export const nordTheme = createPresetTheme(PRESET_DEFINITIONS[3]!)
export const monokaiTheme = createPresetTheme(PRESET_DEFINITIONS[4]!)
export const materialOceanTheme = createPresetTheme(PRESET_DEFINITIONS[5]!)
export const tokyoNightTheme = createPresetTheme(PRESET_DEFINITIONS[6]!)
export const solarizedDarkTheme = createPresetTheme(PRESET_DEFINITIONS[7]!)
export const solarizedLightTheme = createPresetTheme(PRESET_DEFINITIONS[8]!)

export const presetBuiltInThemes: HighlightTheme[] = [
  githubLightTheme,
  draculaTheme,
  oneDarkProTheme,
  nordTheme,
  monokaiTheme,
  materialOceanTheme,
  tokyoNightTheme,
  solarizedDarkTheme,
  solarizedLightTheme
]

export const extraBuiltInThemes: HighlightTheme[] = [
  draculaTheme,
  oneDarkProTheme,
  nordTheme,
  monokaiTheme,
  materialOceanTheme,
  tokyoNightTheme,
  solarizedDarkTheme,
  solarizedLightTheme
]
